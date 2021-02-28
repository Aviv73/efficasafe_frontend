<template>
    <section>
        <v-card class="icons-map">
            <v-card-title>Icons Map</v-card-title>
            <v-chip-group column class="icon-chips">
                <v-chip
                    class="icon-chip text-capitalize"
                    v-for="icon in icons"
                    :key="icon.name"
                >
                    <v-avatar left size="16">
                        <img
                            class="icon-img"
                            contain
                            tile
                            v-if="icon.path"
                            :src="require(`@/cms/assets/icons/${icon.name}.svg`)"
                        />
                        <v-icon v-else :color="icon.color">{{
                            icon.mdi
                        }}</v-icon>
                    </v-avatar>
                    {{ icon.label }}
                </v-chip>
            </v-chip-group>
            <div class="margin-container"></div>
        </v-card>
    </section>
</template>

<script>
export default {
    name: 'IconsMap',
    data() {
        return {
            iconSize: 100,
            icons: [
                {
                    name: 'drug',
                    label: 'drug',
                    path: '@/cms/assets/icons/drug',
                    mdi: '',
                    color: '',
                },
                {
                    name: 'herb',
                    label: 'herb',
                    path: '@/cms/assets/icons/herb',
                    mdi: '',
                    color: '',
                },
                {
                    name: 'vitamin',
                    label: 'vitamin',
                    path: '@/cms/assets/icons/vitamin',
                    mdi: '',
                    color: '',
                },
                {
                    name: 'amino acid',
                    label: 'amino acid',
                    path: '@/cms/assets/icons/amino acid',
                    mdi: '',
                    color: '',
                },
                {
                    name: 'mineral',
                    label: 'mineral',
                    path: '@/cms/assets/icons/mineral',
                    mdi: '',
                    color: '',
                },
                {
                    name: 'nutraceutical',
                    label: 'nutraceutical',
                    path: '@/cms/assets/icons/nutraceutical',
                    mdi: '',
                    color: '',
                },
                {
                    name: 'essential oil',
                    label: 'essential oil',
                    path: '@/cms/assets/icons/essential oil',
                    mdi: '',
                    color: '',
                },
                {
                    name: 'food',
                    label: 'food',
                    path: '@/cms/assets/icons/food',
                    mdi: '',
                    color: '',
                },
                {
                    name: 'custom',
                    label: 'Label',
                    path: '@/cms/assets/icons/custom',
                    mdi: '',
                    color: '',
                },
                {
                    name: 'draftname',
                    label: 'Draft name',
                    path: '@/cms/assets/icons/draftname',
                    mdi: '',
                    color: '',
                },
            ],
        };
    },
};
</script>