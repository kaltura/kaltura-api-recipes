Rails.application.routes.draw do
  get 'index' => 'main#index'
  get 'UploadForm' => 'main#UploadForm'
  get 'UploadDone' => 'main#UploadDone'
  get 'KalturaMediaEntry' => 'main#KalturaMediaEntry'
  post 'CreateMediaEntry' => 'main#CreateMediaEntry'
  post 'UploadFile' => 'main#UploadFile'
  root 'main#index'
end
