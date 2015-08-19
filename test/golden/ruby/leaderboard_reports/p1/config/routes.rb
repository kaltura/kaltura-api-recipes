Rails.application.routes.draw do
  get 'index' => 'main#index'
  get 'KalturaReportTable' => 'main#KalturaReportTable'
  get 'MediaListLikes' => 'main#MediaListLikes'
  post 'listMedia' => 'main#listMedia'
  post 'getTableReport' => 'main#getTableReport'
  root 'main#index'
end
