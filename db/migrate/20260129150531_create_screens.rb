# frozen_string_literal: true

class CreateScreens < ActiveRecord::Migration[8.1]
  def change
    create_table :screens do |t|
      t.jsonb :data, null: false, default: {}

      t.timestamps
    end
  end
end
