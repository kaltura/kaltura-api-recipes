Rails.application.routes.draw do
  get 'index' => 'main#index'
  get 'metadataShow' => 'main#metadataShow'
  post 'updateMetadata' => 'main#updateMetadata'
  root 'main#index'
end
