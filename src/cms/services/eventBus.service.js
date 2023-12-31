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
export const EV_Unauthenticated = 'Unauthenticated';
export const EV_set_tree_view_selection = 'set_tree_view_selection';
export const EV_sign_up_modal = 'open_sign_up_modal';
export const EV_sortby_side_swaped = 'sortby_side_swaped';
export const EV_show_user_msg = 'show-user-msg';
export const EV_show_cookie_notice = 'show-cookie-notice';
export const EV_show_other_login = 'show-other-login';
export const EV_has_failed_tasks = 'has-failed-tasks';
export const EV_has_failed_logs = 'has-failed-logs';
export const EV_search_results_cleared = 'search-results-cleared';
export const EV_focus_on_input = 'focus-on-input';
export const EV_clear_input = 'clear-input';
export const EV_open_signup = 'open-signup';
export const EV_open_login = 'open-login';
export const EV_email_exists = 'email-exists';
export const EV_wrong_provider = 'wrong-provider';
export const EV_update_nav = 'update-nav';
