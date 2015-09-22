Rails.application.routes.draw do
  get 'index' => 'main#index'
  get 'MediaListLikes' => 'main#MediaListLikes'
  post 'listMedia' => 'main#listMedia'
  root 'main#index'
end
