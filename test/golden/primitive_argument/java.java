String entryId = "abcde";
int version = "";

Object result = client.getMediaService().get(entryId, version);
System.out.println(result);

