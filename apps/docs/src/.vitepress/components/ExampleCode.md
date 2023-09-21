```ts
@SlashCommand("Play a song/video from YouTube")
async play(
    ctx: SlashCommand.Context,
    @Param.String("Youtube URL or Search Query")
    song: Param.String.Type
) {
    // function logic
}
```
