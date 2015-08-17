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
require File.dirname(__FILE__) + '/kaltura_event_notification_client_plugin.rb'

module Kaltura

	class KalturaBusinessProcessAbortNotificationTemplateOrderBy
		CREATED_AT_ASC = "+createdAt"
		ID_ASC = "+id"
		UPDATED_AT_ASC = "+updatedAt"
		CREATED_AT_DESC = "-createdAt"
		ID_DESC = "-id"
		UPDATED_AT_DESC = "-updatedAt"
	end

	class KalturaBusinessProcessNotificationTemplateOrderBy
		CREATED_AT_ASC = "+createdAt"
		ID_ASC = "+id"
		UPDATED_AT_ASC = "+updatedAt"
		CREATED_AT_DESC = "-createdAt"
		ID_DESC = "-id"
		UPDATED_AT_DESC = "-updatedAt"
	end

	class KalturaBusinessProcessProvider
		ACTIVITI = "activitiBusinessProcessNotification.Activiti"
	end

	class KalturaBusinessProcessServerOrderBy
		CREATED_AT_ASC = "+createdAt"
		UPDATED_AT_ASC = "+updatedAt"
		CREATED_AT_DESC = "-createdAt"
		UPDATED_AT_DESC = "-updatedAt"
	end

	class KalturaBusinessProcessServerStatus
		DISABLED = "1"
		ENABLED = "2"
		DELETED = "3"
	end

	class KalturaBusinessProcessSignalNotificationTemplateOrderBy
		CREATED_AT_ASC = "+createdAt"
		ID_ASC = "+id"
		UPDATED_AT_ASC = "+updatedAt"
		CREATED_AT_DESC = "-createdAt"
		ID_DESC = "-id"
		UPDATED_AT_DESC = "-updatedAt"
	end

	class KalturaBusinessProcessStartNotificationTemplateOrderBy
		CREATED_AT_ASC = "+createdAt"
		ID_ASC = "+id"
		UPDATED_AT_ASC = "+updatedAt"
		CREATED_AT_DESC = "-createdAt"
		ID_DESC = "-id"
		UPDATED_AT_DESC = "-updatedAt"
	end

	class KalturaBusinessProcessCase < KalturaObjectBase
		attr_accessor :id
		attr_accessor :business_process_id
		attr_accessor :business_process_start_notification_template_id
		attr_accessor :suspended
		attr_accessor :activity_id

		def business_process_start_notification_template_id=(val)
			@business_process_start_notification_template_id = val.to_i
		end
		def suspended=(val)
			@suspended = to_b(val)
		end
	end

	class KalturaBusinessProcessServer < KalturaObjectBase
		# Auto generated identifier
		# 	 
		attr_accessor :id
		# Server creation date as Unix timestamp (In seconds)
		# 	 
		attr_accessor :created_at
		# Server update date as Unix timestamp (In seconds)
		# 	 
		attr_accessor :updated_at
		attr_accessor :partner_id
		attr_accessor :name
		attr_accessor :system_name
		attr_accessor :description
		attr_accessor :status
		# The type of the server, this is auto filled by the derived server object
		# 	 
		attr_accessor :type

		def id=(val)
			@id = val.to_i
		end
		def created_at=(val)
			@created_at = val.to_i
		end
		def updated_at=(val)
			@updated_at = val.to_i
		end
		def partner_id=(val)
			@partner_id = val.to_i
		end
	end

	class KalturaBusinessProcessNotificationTemplate < KalturaEventNotificationTemplate
		# Define the integrated BPM server id
		# 	 
		attr_accessor :server_id
		# Define the integrated BPM process id
		# 	 
		attr_accessor :process_id
		# Code to load the main triggering object
		# 	 
		attr_accessor :main_object_code

		def server_id=(val)
			@server_id = val.to_i
		end
	end

	class KalturaBusinessProcessServerBaseFilter < KalturaFilter
		attr_accessor :id_equal
		attr_accessor :id_in
		attr_accessor :id_not_in
		attr_accessor :created_at_greater_than_or_equal
		attr_accessor :created_at_less_than_or_equal
		attr_accessor :updated_at_greater_than_or_equal
		attr_accessor :updated_at_less_than_or_equal
		attr_accessor :partner_id_equal
		attr_accessor :partner_id_in
		attr_accessor :status_equal
		attr_accessor :status_not_equal
		attr_accessor :status_in
		attr_accessor :status_not_in
		attr_accessor :type_equal
		attr_accessor :type_in

		def id_equal=(val)
			@id_equal = val.to_i
		end
		def created_at_greater_than_or_equal=(val)
			@created_at_greater_than_or_equal = val.to_i
		end
		def created_at_less_than_or_equal=(val)
			@created_at_less_than_or_equal = val.to_i
		end
		def updated_at_greater_than_or_equal=(val)
			@updated_at_greater_than_or_equal = val.to_i
		end
		def updated_at_less_than_or_equal=(val)
			@updated_at_less_than_or_equal = val.to_i
		end
		def partner_id_equal=(val)
			@partner_id_equal = val.to_i
		end
	end

	class KalturaBusinessProcessServerListResponse < KalturaListResponse
		attr_accessor :objects

	end

	class KalturaBusinessProcessAbortNotificationTemplate < KalturaBusinessProcessNotificationTemplate

	end

	class KalturaBusinessProcessNotificationDispatchJobData < KalturaEventNotificationDispatchJobData
		attr_accessor :server
		attr_accessor :case_id

	end

	class KalturaBusinessProcessServerFilter < KalturaBusinessProcessServerBaseFilter

	end

	class KalturaBusinessProcessSignalNotificationTemplate < KalturaBusinessProcessNotificationTemplate
		# Define the message to be sent
		# 	 
		attr_accessor :message
		# Define the event that waiting to the signal
		# 	 
		attr_accessor :event_id

	end

	class KalturaBusinessProcessStartNotificationTemplate < KalturaBusinessProcessNotificationTemplate
		# Abort the process automatically if the triggering object deleted
		# 	 
		attr_accessor :abort_on_deletion

		def abort_on_deletion=(val)
			@abort_on_deletion = to_b(val)
		end
	end

	class KalturaBusinessProcessNotificationTemplateBaseFilter < KalturaEventNotificationTemplateFilter

	end

	class KalturaBusinessProcessNotificationTemplateFilter < KalturaBusinessProcessNotificationTemplateBaseFilter

	end

	class KalturaBusinessProcessAbortNotificationTemplateBaseFilter < KalturaBusinessProcessNotificationTemplateFilter

	end

	class KalturaBusinessProcessSignalNotificationTemplateBaseFilter < KalturaBusinessProcessNotificationTemplateFilter

	end

	class KalturaBusinessProcessStartNotificationTemplateBaseFilter < KalturaBusinessProcessNotificationTemplateFilter

	end

	class KalturaBusinessProcessAbortNotificationTemplateFilter < KalturaBusinessProcessAbortNotificationTemplateBaseFilter

	end

	class KalturaBusinessProcessSignalNotificationTemplateFilter < KalturaBusinessProcessSignalNotificationTemplateBaseFilter

	end

	class KalturaBusinessProcessStartNotificationTemplateFilter < KalturaBusinessProcessStartNotificationTemplateBaseFilter

	end


	# Business-Process server service lets you create and manage servers
	#  
	class KalturaBusinessProcessServerService < KalturaServiceBase
		def initialize(client)
			super(client)
		end

		# Allows you to add a new Business-Process server object
		# 	 
		def add(business_process_server)
			kparams = {}
			client.add_param(kparams, 'businessProcessServer', business_process_server);
			client.queue_service_action_call('businessprocessnotification_businessprocessserver', 'add', kparams);
			if (client.is_multirequest)
				return nil;
			end
			return client.do_queue();
		end

		# Retrieve an Business-Process server object by id
		# 	 
		def get(id)
			kparams = {}
			client.add_param(kparams, 'id', id);
			client.queue_service_action_call('businessprocessnotification_businessprocessserver', 'get', kparams);
			if (client.is_multirequest)
				return nil;
			end
			return client.do_queue();
		end

		# Update an existing Business-Process server object
		# 	 
		def update(id, business_process_server)
			kparams = {}
			client.add_param(kparams, 'id', id);
			client.add_param(kparams, 'businessProcessServer', business_process_server);
			client.queue_service_action_call('businessprocessnotification_businessprocessserver', 'update', kparams);
			if (client.is_multirequest)
				return nil;
			end
			return client.do_queue();
		end

		# Update Business-Process server status by id
		# 	 
		def update_status(id, status)
			kparams = {}
			client.add_param(kparams, 'id', id);
			client.add_param(kparams, 'status', status);
			client.queue_service_action_call('businessprocessnotification_businessprocessserver', 'updateStatus', kparams);
			if (client.is_multirequest)
				return nil;
			end
			return client.do_queue();
		end

		# Delete an Business-Process server object
		# 	 
		def delete(id)
			kparams = {}
			client.add_param(kparams, 'id', id);
			client.queue_service_action_call('businessprocessnotification_businessprocessserver', 'delete', kparams);
			if (client.is_multirequest)
				return nil;
			end
			return client.do_queue();
		end

		# list Business-Process server objects
		# 	 
		def list(filter=KalturaNotImplemented, pager=KalturaNotImplemented)
			kparams = {}
			client.add_param(kparams, 'filter', filter);
			client.add_param(kparams, 'pager', pager);
			client.queue_service_action_call('businessprocessnotification_businessprocessserver', 'list', kparams);
			if (client.is_multirequest)
				return nil;
			end
			return client.do_queue();
		end
	end

	# Business-process case service lets you get information about processes
	#  
	class KalturaBusinessProcessCaseService < KalturaServiceBase
		def initialize(client)
			super(client)
		end

		# Abort business-process case
		# 	 
		def abort(object_type, object_id, business_process_start_notification_template_id)
			kparams = {}
			client.add_param(kparams, 'objectType', object_type);
			client.add_param(kparams, 'objectId', object_id);
			client.add_param(kparams, 'businessProcessStartNotificationTemplateId', business_process_start_notification_template_id);
			client.queue_service_action_call('businessprocessnotification_businessprocesscase', 'abort', kparams);
			if (client.is_multirequest)
				return nil;
			end
			return client.do_queue();
		end

		# Server business-process case diagram
		# 	 
		def serve_diagram(object_type, object_id, business_process_start_notification_template_id)
			kparams = {}
			client.add_param(kparams, 'objectType', object_type);
			client.add_param(kparams, 'objectId', object_id);
			client.add_param(kparams, 'businessProcessStartNotificationTemplateId', business_process_start_notification_template_id);
			client.queue_service_action_call('businessprocessnotification_businessprocesscase', 'serveDiagram', kparams);
			return client.get_serve_url();
		end

		# list business-process cases
		# 	 
		def list(object_type, object_id)
			kparams = {}
			client.add_param(kparams, 'objectType', object_type);
			client.add_param(kparams, 'objectId', object_id);
			client.queue_service_action_call('businessprocessnotification_businessprocesscase', 'list', kparams);
			if (client.is_multirequest)
				return nil;
			end
			return client.do_queue();
		end
	end

	class KalturaClient < KalturaClientBase
		attr_reader :business_process_server_service
		def business_process_server_service
			if (@business_process_server_service == nil)
				@business_process_server_service = KalturaBusinessProcessServerService.new(self)
			end
			return @business_process_server_service
		end
		attr_reader :business_process_case_service
		def business_process_case_service
			if (@business_process_case_service == nil)
				@business_process_case_service = KalturaBusinessProcessCaseService.new(self)
			end
			return @business_process_case_service
		end
	end

end
