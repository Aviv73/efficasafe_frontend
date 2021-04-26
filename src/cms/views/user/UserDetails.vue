<template>
    <div class="user-details-main relative">
        <div class="fix-size-user mt-10" style="display: flex">
            <v-btn color="primary" @click="$router.go(-1)">
                <v-icon small left>mdi-arrow-left</v-icon>Back
            </v-btn>
            <v-spacer></v-spacer>

            <v-btn color="primary" :to="`/user/edit/123`">
                <v-icon small left>mdi-pencil</v-icon>Edit
            </v-btn>
            <v-btn color="error">
                <v-icon small left>mdi-delete</v-icon>Delete
            </v-btn>
        </div>
        <v-card class="fix-size-user" v-if="user">
            <div class="info-title d-flex align-center justify-space-between">
                <v-card-title>{{ user.name }}</v-card-title>
                <v-card-title>{{ user.email }}</v-card-title>
            </div>

            <div class="info-details">
                <div class="info-preview">
                    <div class="title">Full Name</div>
                    <div class="user-info">
                        {{ `${user.given_name} ${user.family_name}` }}
                    </div>
                </div>
            </div>
            <div class="info-details">
                <div class="info-preview">
                    <div class="title">Role</div>
                    <div class="user-info">
                        {{ user.role }}
                    </div>
                </div>
            </div>
            <div class="info-details">
                <div class="info-preview">
                    <div class="title">nickname</div>
                    <div class="user-info">
                        {{ user.nickname }}
                    </div>
                </div>
            </div>
            <div class="info-details">
                <div class="info-preview">
                    <div class="title">email</div>
                    <div class="user-info">
                        {{ user.email }}
                    </div>
                </div>
            </div>
            <div class="info-details">
                <div class="info-preview">
                    <div class="title">Updated at</div>
                    <div class="user-info">
                        {{ user.updated_at | moment('LLL') }}
                    </div>
                </div>
            </div>
            <div class="info-details">
                <div class="info-preview">
                    <div class="title">id</div>
                    <div class="user-info">
                        {{ user._id }}
                    </div>
                </div>
            </div>
            <div class="info-details">
                <div class="info-preview">
                    <div class="title">email verified</div>
                    <div class="user-info">
                        <v-btn
                            class="ma-2"
                            text
                            icon
                            :color="
                                user.email_verified
                                    ? 'blue lighten-2'
                                    : 'red lighten-2'
                            "
                        >
                            <v-icon
                                >mdi-thumb-{{
                                    user.email_verified ? 'up' : 'down'
                                }}</v-icon
                            >
                        </v-btn>
                    </div>
                </div>
            </div>
        </v-card>
        <img :src="user.picture" alt="" />
    </div>
</template>

<script>
export default {
    data() {
        return {
            user: null,
            isNotFound: false,
        };
    },
    watch: {
        '$route.params.id': function () {
            this.loadUser();
        },
    },
    methods: {
        async loadUser() {
            const userId = this.$route.params.id;
            if (userId) {
                const user = await this.$store.dispatch({
                    type: 'loadUser',
                    userId,
                });
                if (user) this.user = user;
                else this.isNotFound = true;
            }
        },
    },
    created() {
        this.loadUser();
    },
};
</script>

<style lang="scss" scoped>
.fix-size-user {
    margin: 0 auto;
    width: 80%;
}

.info-preview {
    padding: 16px;
    display: flex;
    align-items: center;
    justify-content: space-between;
}

.relative {
    position: relative;
}

img {
    position: absolute;
    left: 45%;
    top: 45%;
    border-radius: 50%;
}
</style>