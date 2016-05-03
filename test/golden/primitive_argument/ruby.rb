entry_id = "abcde"

version = ""

results = client.media_service.get(
    entryId,
    version)
puts results.inspect

