import { materialService } from '@/services/material.service';

export const materialStore = ({
    state: {
        materials: null,
        total: 0
    },
    getters: {
        materials(state) {
            return state.materials;
        },
        total(state) {
            return state.total;
        }
    },
    mutations: {
        setMaterials(state, { materials }) {
            state.materials = materials;
        },
        addMaterial(state, { material }) {
            state.materials.unshift(material);
        },
        updateMaterial(state, { material }) {
            const idx = state.materials.findIndex(currMaterial => currMaterial._id === material._id);
            state.materials.splice(idx, 1, material);
        },
        removeMaterial(state, { matId }) {
            const idx = state.materials.findIndex(currMaterial => currMaterial._id === matId);
            state.materials.splice(idx, 1);
        },
        setTotalCount(state, { total }) {
            state.total = total;
        },
        importRefSheet(state, { refSheet }) {
            return materialService.importRefSheet(refSheet);
        },
        setMaterialLabels(state, { data }) {
            data.ids.forEach(id => {
                if (!state.materials) return;
                const material = state.materials.find(mat => mat._id === id);
                if (material) {
                    const label = material.labels.find(label => label._id === data.label._id);
                    if (!label) material.labels.push(data.label);
                }
            });
        }
    },
    actions: {
        async loadMaterials(context, { criteria }) {
            const { materials, total } = await materialService.list(criteria);
            context.commit({ type: 'setMaterials', materials });
            context.commit({ type: 'setTotalCount', total });
            return materials;
        },
        async loadAutoCompleteResults(context, { criteria }) {
            const { materials } = await materialService.list(criteria);
            return materials;
        },
        async loadMaterial(context, { matId }) {
            return await materialService.getById(matId);
        },
        async saveMaterial(context, { material }) {
            const isEdit = !!material._id;
            const savedMaterial = await materialService.save(material);
            context.commit({
                type: (isEdit) ? 'updateMaterial' : 'addMaterial',
                material: savedMaterial
            })
            return savedMaterial;
        },
        async restoreMaterial(context, { material }) {
            return await materialService.restore(material);
        },
        async removeMaterial(context, { matId }) {
            await materialService.remove(matId);
            context.commit({
                type: "removeMaterial",
                matId
            });
        },
        async updateMaterials(context, { data }) {
            const res = await materialService.updateMaterials(data);
            if (res.ok) {
                context.commit({ type: 'setMaterialLabels', data });
            }
        }
    }
})