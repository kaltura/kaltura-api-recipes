# ===================================================================================================
#                           _  __     _ _
#                          | |/ /__ _| | |_ _  _ _ _ __ _
#                          | ' </ _` | |  _| || | '_/ _` |
#                          |_|\_\__,_|_|\__|\_,_|_| \__,_|
#
# This file is part of the Kaltura Collaborative Media Suite which allows users
# to do with audio, video, and animation what Wiki platfroms allow them to do with
# text.
#
# Copyright (C) 2006-2015  Kaltura Inc.
#
# This program is free software: you can redistribute it and/or modify
# it under the terms of the GNU Affero General Public License as
# published by the Free Software Foundation, either version 3 of the
# License, or (at your option) any later version.
#
# This program is distributed in the hope that it will be useful,
# but WITHOUT ANY WARRANTY; without even the implied warranty of
# MERCHANTABILITY or FITNESS FOR A PARTICULAR PURPOSE.  See the
# GNU Affero General Public License for more details.
#
# You should have received a copy of the GNU Affero General Public License
# along with this program.  If not, see <http:#www.gnu.org/licenses/>.
#
# @ignore
# ===================================================================================================
require 'kaltura_client.rb'
require File.dirname(__FILE__) + '/kaltura_drop_folder_client_plugin.rb'

module Kaltura

	class KalturaFeedItemInfo < KalturaObjectBase
		attr_accessor :item_xpath
		attr_accessor :item_publish_date_xpath
		attr_accessor :item_unique_identifier_xpath
		attr_accessor :item_content_file_size_xpath
		attr_accessor :item_content_url_xpath
		attr_accessor :item_content_bitrate_xpath
		attr_accessor :item_hash_xpath
		attr_accessor :item_content_xpath
		attr_accessor :content_bitrate_attribute_name

	end

	class KalturaFeedDropFolder < KalturaDropFolder
		attr_accessor :item_handling_limit
		attr_accessor :feed_item_info

		def item_handling_limit=(val)
			@item_handling_limit = val.to_i
		end
	end

	class KalturaFeedDropFolderFile < KalturaDropFolderFile
		# MD5 or Sha1 encrypted string
		# 	 
		attr_accessor :hash
		# Path of the original Feed content XML
		# 	 
		attr_accessor :feed_xml_path

	end


end
