<template>
    <section class="search-engine">
        <div class="container">
            <v-card>
                <header class="search-engine-header">
                    <v-card-title class="text-capitalize px-0">
                        Search engine
                    </v-card-title>
                    <v-text-field 
                        class="search-engine-header-search-field"
                        color="primary"
                        label="Search"
                        append-icon="mdi-magnify"
                        :loading="isLoading"
                    />
                </header>
                <main>
                    <img 
                        src="https://i1.wp.com/whiterivernow.com/wp-content/uploads/2018/12/Under-Construction-Sign.png?fit=1230%2C580&ssl=1" 
                        style="width: 100%;"
                        />
                </main>
                <v-divider></v-divider>
            </v-card>
            <icons-map />
        </div>
    </section>
</template>

<script>
import iconsMap from '@/cmps/general/IconsMap';

export default {
    data() {
        return {
            isLoading: false
        }
    },
    components: {
        iconsMap
    }
}
</script>