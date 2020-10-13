import { materialService } from '@/services/material.service';

export const materialStore = ({
    state: {
        materials: null
    },
    getters: {
        materials(state) {
            return state.materials;
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
        importRefSheet(state, { refSheet }) {
            return materialService.importRefSheet(refSheet);
        }
    },
    actions: {
        async loadMaterials(context, { criteria }) {
            const materials = await materialService.list(criteria);
            context.commit({ type: 'setMaterials', materials });
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
        async removeMaterial(context, { matId }) {
            await materialService.remove(matId);
            context.commit({
                type: "removeMaterial",
                matId
            });
        }
    }
})