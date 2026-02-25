# frozen_string_literal: true

class CreateScreens < ActiveRecord::Migration[8.1]
  def change
    create_table :screens do |t|
      t.jsonb :data, null: false, default: {}
      t.references :app_flow, null: false, foreign_key: true

      t.timestamps
    end
  end
end
