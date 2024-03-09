# Francium
## - a light-weight video player
Francium, formerly known as "LVP", is an alternative to the default Windows video player, made for Windows 10/11. (This project is not associated with Microsoft)

## What it can do
Francium just plays videos for you... Nothing more! I mean, what else is a video player supposed to do?

##### **It is very simple:**
It can playback videos comfortably, giving you the options to make the videos fullscreen, seek and much more!

## Installation instructions
- Download the latest installer from the [Installer Page](https://github.com/vld-b/Francium-video-player/releases)
- Start the installer (provided with release) and make note of the installation location on your way through (default: "C:\Program Files\Francium Video Player")
- Then, in Windows settings, change the app that opens ".mp4" files and point it to the installation location (see above). [Official Microsoft guide to change standard apps](https://support.microsoft.com/en-us/windows/change-default-programs-in-windows-e5d82cad-17d1-c53b-3505-f10a32e1894d)
- The app is untested with other video formats, but it might work. If it happens you test another format, please make sure to make an issue about it in the "Issues" section and provide details about the file format to help me (the developer) and other users. Thanks in advance!
- Done! Now just double click or open a video like you usually would and it'll open with Francium!

## Performance
In the beginning, Francium was pretty slow, averaging a couple of seconds to load a 30-second video. Now, though, it has been optimized to load videos much faster, giving you faster loading times that before!

## Development
For its front-end it uses Typescript with the [SolidJS](https://www.solidjs.com) framework and for its back-end it uses Rust with the [Tauri](https://tauri.app) framework, both super performant!