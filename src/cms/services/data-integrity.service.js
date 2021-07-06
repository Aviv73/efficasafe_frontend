import { httpService } from './http.service';
import { eventBus, EV_has_failed_tasks } from './eventBus.service';

const END_POINT = 'data-integrity';

export const dataIntegrityService = {
    list,
    getById,
    updateTask
}
_poll();

function list(filterBy) {
    return httpService.get(END_POINT, filterBy);
}

function getById(matId) {
    return httpService.get(`${END_POINT}/${matId}`);
}

function updateTask(task) {
    return httpService.put(`${END_POINT}/${task._id}`, task);
}

async function _poll() {
    const tasks = await list({ type: 'get-failed-tasks' });
    if (tasks.length) {
        eventBus.$emit(EV_has_failed_tasks);
    } else {
        setTimeout(_poll, 12 * 60 * 60 * 1000);
    }
}