Rails.application.routes.draw do
  get 'index' => 'main#index'
  get 'DynamicThumbnails' => 'main#DynamicThumbnails'
  post 'listMedia' => 'main#listMedia'
  root 'main#index'
end
