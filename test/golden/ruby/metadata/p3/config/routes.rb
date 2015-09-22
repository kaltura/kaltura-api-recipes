Rails.application.routes.draw do
  get 'index' => 'main#index'
  get 'KalturaMetadataProfileListResponse' => 'main#KalturaMetadataProfileListResponse'
  get 'metadataProfileShow' => 'main#metadataProfileShow'
  get 'metadataProfileDeleted' => 'main#metadataProfileDeleted'
  post 'listMetadataProfile' => 'main#listMetadataProfile'
  post 'deleteMetadataProfile' => 'main#deleteMetadataProfile'
  root 'main#index'
end
