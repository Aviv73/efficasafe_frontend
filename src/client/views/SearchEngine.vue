<template>
    <section class="search-engine">
        <div class="search-engine-container">
            <span class="brim-start"></span>
            <div class="search-engine-search flex-coloumn">
                <figure class="logo">
                    <img
                        src="@/client/assets/imgs/logo-symbol.png"
                        alt="Logo"
                    />
                    <img
                        src="@/client/assets/imgs/logo-txt.png"
                        alt="Efficasafe"
                    />
                </figure>
                <p class="search-engine-search-msg">
                    <span class="font-medium">6</span>
                    Free searches left
                </p>
                <button class="btn">Register for free trial</button>
                <autocomplete
                    class="search-engine-search-bar"
                    :isOnSearchPage="true"
                    placeholder="+   Search herb / drug"
                />
                <ul class="search-engine-search-list"></ul>
                <div class="search-engine-search-actions">
                    <router-link to="/search">Clear search</router-link> |
                    Save search
                </div>
            </div>
            <div class="search-engine-results"></div>
            <span class="brim-end"></span>
        </div>
    </section>
</template>

<script>
import Autocomplete from '@/client/cmps/shared/Autocomplete';

export default {
    name: 'SearchEngine',
    components: {
        Autocomplete
    }
};
</script>
