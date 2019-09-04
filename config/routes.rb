Rails.application.routes.draw do
  devise_for :users
  # Routes to homeapage
  root to: 'pages#home'
  resources :posts, only: [:new, :create] do
    # This route will coming later
    resources :comments, only: :create
    # This route will coming later
    resources :post_upvotes, only: :create
  end
  # For details on the DSL available within this file, see http://guides.rubyonrails.org/routing.html
  # Routes to main map
  get "map", to: "maps#show", as: :map
  get "posts/:id", to: "posts#show", as: :post
end
