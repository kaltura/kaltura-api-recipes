Rails.application.routes.draw do
  get 'index' => 'main#index'
  get 'metadataProfileShow' => 'main#metadataProfileShow'
  post 'addMetadataProfile' => 'main#addMetadataProfile'
  root 'main#index'
end
