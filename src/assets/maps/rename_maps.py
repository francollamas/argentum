import os
import re

def rename_map_files():
    # Get the directory where this script is located
    script_dir = os.path.dirname(os.path.abspath(__file__))
    
    # Pattern to match both 'Mapa' and 'mapa' followed by numbers and .map
    pattern = re.compile(r'(?i)mapa(\d+)\.map$')
    
    # Counter for renamed files
    renamed_count = 0
    
    # Iterate through all files in the directory
    for filename in os.listdir(script_dir):
        # Check if the file matches our pattern
        match = pattern.match(filename)
        if match:
            # Extract the number part
            number = match.group(1)
            new_name = f"{number}.map"
            
            # Get full paths
            old_path = os.path.join(script_dir, filename)
            new_path = os.path.join(script_dir, new_name)
            
            # Check if the new filename already exists
            if os.path.exists(new_path):
                print(f"Warning: {new_name} already exists. Skipping {filename}")
                continue
                
            # Rename the file
            try:
                os.rename(old_path, new_path)
                print(f"Renamed: {filename} -> {new_name}")
                renamed_count += 1
            except Exception as e:
                print(f"Error renaming {filename}: {e}")
    
    print(f"\nRenamed {renamed_count} files.")

if __name__ == "__main__":
    rename_map_files()
