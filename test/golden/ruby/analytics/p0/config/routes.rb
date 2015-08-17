Rails.application.routes.draw do
  get 'index' => 'main#index'
  get 'KalturaReportTotal' => 'main#KalturaReportTotal'
  post 'getTotalReport' => 'main#getTotalReport'
  root 'main#index'
end
