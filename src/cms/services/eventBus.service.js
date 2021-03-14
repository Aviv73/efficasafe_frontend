import Vue from 'vue';

export const eventBus = new Vue();

// Event names
export const EV_addMaterial = 'add-material';
export const EV_addLabel = 'add-label';
export const EV_addInteraction = 'add-interaction';
export const EV_emptySelection = 'empty-selection';
export const EV_cleanSelection = 'clean-selection';
export const EV_material_unselected = 'material-unselected';
export const EV_primary_material_changed = 'primary-material-changed';
export const EV_refresh_root_tree_view = 'refresh-root-tree-view';
export const EV_clear_autocomplete = 'clear-autocomplete';
export const EV_edit_interaction_failed = 'edit-interaction-failed';
export const EV_set_tree_view_selection = 'set_tree_view_selection';

