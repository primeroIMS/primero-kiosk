# frozen_string_literal: true

# Copyright (c) 2014 - 2023 UNICEF. All rights reserved.

class CreateSystemSettings < ActiveRecord::Migration[5.0]
  def change
    create_table :system_settings do |t|
      t.string :configuration_file_version
      t.jsonb :system_options, default: {}
    end
  end
end
