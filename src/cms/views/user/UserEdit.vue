<template>
    <section v-if="editedUser">
        <div class="container">
            <v-card class="user-edit">
                <v-form v-model="valid" @submit.prevent="saveUser">
                    <div class="user-edit-inputs pa-5">
                        <v-text-field
                            type="text"
                            v-model="editedUser.name"
                            label="Name*"
                            required
                            :rules="[(v) => !!v || 'Label Name is required']"
                        />
                        <v-text-field
                            type="text"
                            v-model="editedUser.nickname"
                            label="username*"
                            required
                        />
                        <v-text-field
                            type="text"
                            v-model="editedUser.email"
                            label="Email*"
                            required
                        />
                        <v-select
                            :items="items"
                            label="Role"
                            dense
                            v-model="editedUser.role"
                        ></v-select>

                        <v-menu
                            ref="menu"
                            v-model="menu"
                            :close-on-content-click="false"
                            :return-value.sync="date"
                            transition="scale-transition"
                            offset-y
                            min-width="auto"
                        >
                            <template v-slot:activator="{ on, attrs }">
                                <v-text-field
                                    v-model="date"
                                    label="End of subscription"
                                    prepend-icon="mdi-calendar"
                                    readonly
                                    v-bind="attrs"
                                    v-on="on"
                                ></v-text-field>
                            </template>
                            <v-date-picker v-model="date" no-title scrollable>
                                <v-spacer></v-spacer>
                                <v-btn
                                    text
                                    color="primary"
                                    @click="menu = false"
                                >
                                    Cancel
                                </v-btn>
                                <v-btn text color="primary" @click="saveDate">
                                    OK
                                </v-btn>
                            </v-date-picker>
                        </v-menu>
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
        <div class="container">
            <v-card class="pa-5 text-center">
                <p>user purchase history</p>
            </v-card>
        </div>
    </section>
</template>

<script>
import { userService } from '../../services/user.service';
export default {
    data() {
        return {
            editedUser: null,
            valid: true,
            items: ['admin', 'user', 'editor'],
            date: new Date().toISOString().substr(0, 10),
            menu: false,
            modal: false,
            menu2: false,
        };
    },
    methods: {
        saveDate() {
            this.$refs.menu.save(this.date);
            const dateFormat = new Date(this.date).getTime();
            this.editedUser.trialTime = dateFormat;
        },
        async loadUser() {
            const userId = this.$route.params.id;
            let user = null;
            if (userId)
                user = await this.$store.dispatch({ type: 'loadUser', userId });
            else user = userService.getEmptyUser();
            console.log(user);
            this.editedUser = JSON.parse(JSON.stringify(user));
            this.date = new Date(user.trialTime).toISOString().substr(0, 10);
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
    watch: {
        editedUser(val) {
            console.log(val.trialTime);
        },
    },
};
</script>

<style scoped>
.user-edit-inputs {
    width: 50%;
    margin: 0 auto;
}
</style>