# 📁 Max file size

A lightweight Windows batch script that finds and displays the largest file in any directory — recursively.

---

## Usage

1. **Download** `max_file_size.cmd`
2. **Double-click** to run, or launch it from the terminal:

```cmd
max_file_size.cmd
```

3. **Enter a directory path** when prompted:

```
Enter directory path: C:\Users\YourName\Documents
```

4. **Get your result:**

```
 Largest File : C:\Users\YourName\Documents\backup.zip
 Size         : 104857600 bytes
```

---

## Features

- ✅ No dependencies — pure Windows CMD
- ✅ Recursive search through all subdirectories
- ✅ Works on any Windows machine out of the box
- ✅ Displays full file path and exact size in bytes

---

## Options

**Non-recursive mode** (only scans the top-level folder):

Open the file and change line 20 from:

```cmd
for /r "%TARGET_DIR%" %%F in (*) do (
```

to:

```cmd
for %%F in ("%TARGET_DIR%\*") do (
```

---

## Requirements

- Windows 7 or later
- No admin privileges required

---

## License

MIT — free to use, modify, and distribute.
