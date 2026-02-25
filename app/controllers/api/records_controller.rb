# frozen_string_literal: true

# API controller for managing cases.
class Api::RecordsController < ApplicationApiController
  before_action :instantiate_app_services

  def create
    PrimeroSyncJob.perform_later(record_params)
  end

  def record_params
    params.require(:record_type)
    params.expect(data: :module_id)
    params.permit(:record_type, data: [:module_id] + permitted_field_ids)
  end

  def permitted_field_ids
    @permitted_field_ids ||= @permitted_field_service.permitted_field_ids.map(&:to_sym)
  end

  def instantiate_app_services
    @permitted_field_service = PermittedFieldService.instance
  end
end
