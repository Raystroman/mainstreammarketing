# Image & Media Assets Used

## Images (Google AIDA-generated, hotlinked)

These images are served from `lh3.googleusercontent.com`. They are not stored locally — they are loaded directly from Google's CDN. To use your own assets, replace the `src` values in `index.html`.

### 1. Hero background (large detailing/garage scene)
```
https://lh3.googleusercontent.com/aida-public/AB6AXuDfI2uay7iU0RR4BerjGofT21jD_o_RHiOhtc7z_6WRhmgi44N-vBswIB4YTNNLB38KFbwo74x8k6fUMQenvcR7hl5bMubsyzEyxXkjAbKVTLOI3QLytZo2C55tJixsnbvB2t6PcUDmc8UBOv5u4HmXZapXzWZ-kyyEKk-N3GuA8jiMfDVpSNCGQFM_BeGW6uTrrSPHv6qNcb_0Ue7O7RKBN4E8n0leBsuiv3Pw-cb-zyn57QIqfY0rIrR2HtiMkUyI0O6U3pg260Ss
```
Used as: `<img>` background of the hero section (grayscale, 50–60% opacity).

### 2. Social-proof avatar #1
```
https://lh3.googleusercontent.com/aida-public/AB6AXuCZWTX-3Y4TEwRD8HnXDsV0hJF3BplAvltyHDZAFZkSHka7hO_HdIxRk0nbHe66PNIuUv3DfhU-yiOsiztGkNqDZD0gq9pUtR_AFg6ShWgfXqhRZWG0N53gFmFqplTgG0HfCP0eSrDz7y3MufsOtGoupgg3vwIKVCi7a7g64DvFLMELuc01CnEAsd18FVgnTcyTFubSQ8PGP5Fzv3xaVtab3pt0F4uqs4_hAHpubafaNah0KM5UB3z3EwtKc5xUTyd5E_CMmpyAbiqC
```
Used as: 36×36 round avatar in the "500+ shops" stack under the hero CTA.

### 3. Social-proof avatar #2
```
https://lh3.googleusercontent.com/aida-public/AB6AXuD96V88j9biqjv0keQeaOLtuIRMrZVhIZs8vutsnhmGQ2zHr091Xx2eLOyiuq6fiymdzNSabx2mEC3zMSBUZJaNYFp-a7bBSqWcCD25wC-um79at3c54K_myMY4ibDD7ry1t4JBeG3xTPW3qIXZvnl64Y5SwKigoosfeFbOu1uw1vPHGftohqvXmx0_ydBSnDy4D6hPghBExwbit0pYYrbdU4doQ3Ge0TwUqL2c5o7_tQTcxnH_6wdr5Pa_5_60kJkFZUm01-Gf8Tg5
```
Used as: second 36×36 round avatar in the social-proof stack.

## Video

### Case-study background loop (HLS stream from Mux)
```
https://stream.mux.com/B85ezsaxI8U7tetCHNa4yARswdkmy02WGSb91c2vj4Ac.m3u8
```
Used as: autoplay/muted/loop `<video>` inside the "From ghost town to fully booked" case-study card.

## Notes
- **No local images** are stored in the project. Everything is hotlinked.
- **Icons** are rendered via Google's `Material Symbols Outlined` font (loaded via `<link>` in `index.html`) — no image files.
- **Fonts**: Sora + Inter via Google Fonts.
- **Tailwind CSS**: loaded via the Tailwind Play CDN.
