import os
import sys
import pydub
from pydub import AudioSegment

def main():
    audio_path = 'public/audio/47K_Audio.mp3'
    output_dir = 'public/audio'
    
    print(f"Loading {audio_path}...")
    audio = AudioSegment.from_file(audio_path)
    total_ms = len(audio)
    print(f"Total duration: {total_ms / 1000.0:.2f} s ({total_ms / 60000.0:.2f} mins)")
    
    # Target clip duration ~ 4.5 minutes (270,000 ms)
    target_clip_ms = 270 * 1000
    search_window_ms = 20 * 1000 # +/- 20 seconds search window
    chunk_step_ms = 250 # 250ms precision for energy evaluation
    
    # Determine split points
    cut_points = [0]
    current_ms = target_clip_ms
    
    while current_ms < total_ms - 60000: # ensure last clip is at least 1 min
        window_start = max(0, current_ms - search_window_ms)
        window_end = min(total_ms, current_ms + search_window_ms)
        
        best_cut = current_ms
        min_db = 100.0
        
        for t in range(window_start, window_end, chunk_step_ms):
            sample = audio[t:t+500]
            db = sample.dBFS
            if db < min_db:
                min_db = db
                best_cut = t + 250
                
        cut_points.append(best_cut)
        print(f"Found cut point at {best_cut / 1000.0:.2f}s (Min dBFS: {min_db:.2f})")
        current_ms = best_cut + target_clip_ms

    cut_points.append(total_ms)
    
    print(f"\nTotal clips to generate: {len(cut_points) - 1}")
    
    generated_files = []
    for idx in range(len(cut_points) - 1):
        start_ms = cut_points[idx]
        end_ms = cut_points[idx+1]
        
        clip = audio[start_ms:end_ms]
        # Apply 1.5s fade in and fade out
        clip = clip.fade_in(1500).fade_out(1500)
        
        filename = f"47K_Phase_{idx+1:02d}.mp3"
        filepath = os.path.join(output_dir, filename)
        
        print(f"Exporting Clip {idx+1:02d}: {filename} ({(end_ms - start_ms)/1000.0:.1f}s)...")
        clip.export(filepath, format="mp3", bitrate="192k")
        generated_files.append(filename)
        
    print(f"\nSuccessfully generated {len(generated_files)} clips!")
    return generated_files

if __name__ == '__main__':
    main()
