# frozen_string_literal: true

# Respond with a 403 Forbidden. Lock down some ActiveStorage endpoints
class ForbiddenController < ApplicationController
  def forbid!
    render plain: 'Forbidden', status: 403
  end
end
