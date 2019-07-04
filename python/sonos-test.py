import soco

speakers = soco.discover()

# Display a list of speakers
for speaker in speakers:
    print("{} ({})".format(speaker.player_name, speaker.ip_address))
    print(speaker)

# Play a speaker
# speakers.pop().group.coordinator.play()
