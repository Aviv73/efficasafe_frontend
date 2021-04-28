<template>
    <div class="container">
        <v-card class="user-edit" v-if="editedUser">
            <v-form v-model="valid" @submit.prevent="saveUser">
                <div class="user-edit-inputs">
                    <v-text-field
                        type="text"
                        v-model="editedUser.name"
                        label="Name*"
                        required
                        :rules="[(v) => !!v || 'Label Name is required']"
                    />
                    <v-text-field
                        type="text"
                        v-model="editedUser.email"
                        label="Email*"
                        required
                    />
                    <v-select :items="items" label="Role" dense></v-select>
                </div>

                <div class="d-flex align-center justify-center mt-4">
                    <h3 class="mr-6">email verified?</h3>
                    <v-switch
                        v-model="editedUser.email_verified"
                        inset
                        :label="`${editedUser.email_verified}`"
                    ></v-switch>
                </div>

                <v-divider class="mt-4" />
                <div
                    class="form-actions d-flex"
                    style="justify-content: space-between"
                >
                    <v-btn class="cancel-btn" to="/user/" color="normal"
                        >cancel</v-btn
                    >

                    <v-btn
                        class="submit-btn"
                        @click="saveUser"
                        color="success"
                        :disabled="!valid"
                        >Save User</v-btn
                    >
                </div>
            </v-form>
        </v-card>
    </div>
</template>

<script>
import { userService } from '../../services/user.service';
export default {
    data() {
        return {
            editedUser: null,
            valid: true,
            items: ['admin', 'user', 'editor'],
        };
    },
    methods: {
        async loadUser() {
            const userId = this.$route.params.id;
            let user = null;
            if (userId)
                user = await this.$store.dispatch({ type: 'loadUser', userId });
            else user = userService.getEmptyUser();
            this.editedUser = JSON.parse(JSON.stringify(user));
        },
        async saveUser() {
            if (!this.editedUser.name) return;
            await this.$store.dispatch({
                type: 'updateUser',
                user: this.editedUser,
            });
        },
    },
    created() {
        this.loadUser();
    },
};
</script>

<style scoped>
.user-edit-inputs {
    width: 50%;
    margin: 0 auto;
}
</style>