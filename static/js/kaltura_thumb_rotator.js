/*
This file is part of the Kaltura Collaborative Media Suite which allows users
to do with audio, video, and animation what Wiki platfroms allow them to do with
text.

Copyrighted Kaltura Inc.
Licensed under AGPL.

The Kaltura Thumb Rotator object lets you show a thumbnail slideshow preview for a video hosted on the Kaltura platform

In order to use the KalturaThumbRotator object, include its javascript code and attach two events to each img element you want to preview.

Sample:

<img src="http://cdn.kaltura.com/p/1/sp/1/thumbnail/entry_id/y2ahhtvvsk/width/160/height/120" width="160" height="120" 
	onmouseover="KalturaThumbRotator.start(this)" 
	onmouseout="KalturaThumbRotator.end(this)">

KalturaThumbRotator.start(this) cancels the current running preview and starts a new one
KalturaThumbRotator.end(this) cancels the current running preview and restores the original thumbnail

*/

KalturaThumbRotator = {

	slices : 40, // number of thumbs per video
	frameRate : 400, // frameRate in milliseconds for changing the thumbs
	
	timer : null,
	slice : 0,
	img  : new Image(),
	
	thumbBase : function (o) // extract the base thumb path by removing the slicing parameters
	{
		var path = o.src;
		var pos = path.indexOf("/vid_slice");
		if (pos != -1)
			path = path.substring(0, pos);
			
		return path;
	},
	

	change : function (o, i) // set the Nth thumb, request the next one and set a timer for showing it
	{
		slice = (i + 1) % this.slices;

		var path = this.thumbBase(o);
		
		o.src = path + "/vid_slice/" + i + "/vid_slices/" + this.slices;
		this.img.src = path + "/vid_slice/" + slice + "/vid_slices/" + this.slices;

		i = i % this.slices;
		i++;
		
		this.timer = setTimeout(function () { KalturaThumbRotator.change(o, i) }, this.frameRate);
	},
	
	start : function (o) // reset the timer and show the first thumb
	{
		clearTimeout(this.timer);
		var path = this.thumbBase(o);
		this.change(o, 1);
	},

	end : function (o) // reset the timer and restore the base thumb
	{
		clearTimeout(this.timer);
		o.src = this.thumbBase(o);
	}
};