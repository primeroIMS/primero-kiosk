# frozen_string_literal: true

Rails.application.config.active_storage.previewers = []
Rails.application.config.active_storage.analyzers = [ActiveStorage::Analyzer::ImageAnalyzer::Vips]
