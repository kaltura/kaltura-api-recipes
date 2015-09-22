Rails.application.routes.draw do
  get 'index' => 'main#index'
  get 'KalturaMetadataListResponse' => 'main#KalturaMetadataListResponse'
  get 'metadataShow' => 'main#metadataShow'
  get 'metadataDeleted' => 'main#metadataDeleted'
  post 'listMetadata' => 'main#listMetadata'
  post 'deleteMetadata' => 'main#deleteMetadata'
  root 'main#index'
end
