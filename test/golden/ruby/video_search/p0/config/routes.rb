Rails.application.routes.draw do
  get 'index' => 'main#index'
  get 'KalturaMediaListResponse' => 'main#KalturaMediaListResponse'
  get 'KalturaMediaEntry' => 'main#KalturaMediaEntry'
  post 'listMedia' => 'main#listMedia'
  root 'main#index'
end
