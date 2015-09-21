Rails.application.routes.draw do
  get 'index' => 'main#index'
  get 'metadataProfileShow' => 'main#metadataProfileShow'
  get 'metadataShow' => 'main#metadataShow'
  get 'KalturaMetadataProfileListResponse' => 'main#KalturaMetadataProfileListResponse'
  get 'metadataProfileDeleted' => 'main#metadataProfileDeleted'
  post 'addMetadataProfile' => 'main#addMetadataProfile'
  post 'addMetadata' => 'main#addMetadata'
  post 'deleteMetadataProfile' => 'main#deleteMetadataProfile'
  post 'listMetadataProfile' => 'main#listMetadataProfile'
  root 'main#index'
end
