Rails.application.routes.draw do
  get 'index' => 'main#index'
  get 'KalturaUser' => 'main#KalturaUser'
  post 'getUser' => 'main#getUser'
  root 'main#index'
end
