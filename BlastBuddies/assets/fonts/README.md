# Fonts for BlastBuddies

Place the following TTF files in this directory, then run:
```
npx react-native-asset
```

This copies them to:
- `android/app/src/main/assets/fonts/`
- `ios/BlastBuddies/Resources/` (plus updates Info.plist)

---

## Baloo 2 (required)

Download from: https://fonts.google.com/specimen/Baloo+2

Place these files here:
- `Baloo2-Regular.ttf`
- `Baloo2-SemiBold.ttf`
- `Baloo2-Bold.ttf`
- `Baloo2-ExtraBold.ttf`

**React Native font family name** (as used in the source code):
- File `Baloo2-Bold.ttf` → `fontFamily: 'Baloo2-Bold'`
- File `Baloo2-ExtraBold.ttf` → `fontFamily: 'Baloo2-ExtraBold'`

On Android, RN derives the font family name from the file name (minus extension).
On iOS, it uses the PostScript name embedded in the font file.

If iOS PostScript names differ, add to `Info.plist` manually:
```xml
<key>UIAppFonts</key>
<array>
  <string>Baloo2-Regular.ttf</string>
  <string>Baloo2-Bold.ttf</string>
  <string>Baloo2-ExtraBold.ttf</string>
</array>
```

---

## Fredoka (optional — only used as fallback in prototype)

The React Native app uses `Baloo 2` exclusively. Fredoka is not referenced in the RN source code.

---

## Fallback

Until fonts are installed, the app uses the system default font (San Francisco on iOS, Roboto on Android). All text will still render correctly, just without the rounded display style.
