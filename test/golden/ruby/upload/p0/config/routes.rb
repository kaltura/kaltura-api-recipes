Rails.application.routes.draw do
  get 'index' => 'main#index'
  get 'UploadForm' => 'main#UploadForm'
  get 'UploadDone' => 'main#UploadDone'
  get 'CreatedEntry' => 'main#CreatedEntry'
  get 'KalturaMediaEntry' => 'main#KalturaMediaEntry'
  root 'main#index'
end
