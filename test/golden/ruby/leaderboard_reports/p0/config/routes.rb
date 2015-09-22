Rails.application.routes.draw do
  get 'index' => 'main#index'
  get 'KalturaReportTable' => 'main#KalturaReportTable'
  post 'getTableReport' => 'main#getTableReport'
  root 'main#index'
end
