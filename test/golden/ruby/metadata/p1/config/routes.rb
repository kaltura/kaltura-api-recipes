Rails.application.routes.draw do
  get 'index' => 'main#index'
  get 'metadataShow' => 'main#metadataShow'
  post 'addMetadata' => 'main#addMetadata'
  root 'main#index'
end
