# frozen_string_literal: true

# Home controller handles the root path of the application
class HomeController < ApplicationController
  def index
    render layout: 'application'
  end
end
