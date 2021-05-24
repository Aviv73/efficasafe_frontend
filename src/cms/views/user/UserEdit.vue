<template>
    <section v-if="editedUser">
        <div class="container">
            <v-card class="user-edit">
                <v-btn
                    class="submit-btn top-right"
                    @click="saveUser"
                    color="success"
                    :disabled="!valid"
                    >Save User</v-btn
                >
                <div class="user-edit-container d-flex">
                    <div class="left-side">
                        <v-form v-model="valid" @submit.prevent="saveUser">
                            <div class="user-edit-inputs pa-5">
                                <v-text-field
                                    type="text"
                                    v-model="editedUser.name"
                                    label="Name*"
                                    required
                                    :rules="[
                                        (v) => !!v || 'Label Name is required',
                                    ]"
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
                                    <v-date-picker
                                        v-model="date"
                                        no-title
                                        scrollable
                                    >
                                        <v-spacer></v-spacer>
                                        <v-btn
                                            text
                                            color="primary"
                                            @click="menu = false"
                                        >
                                            Cancel
                                        </v-btn>
                                        <v-btn
                                            text
                                            color="primary"
                                            @click="saveDate"
                                        >
                                            OK
                                        </v-btn>
                                    </v-date-picker>
                                </v-menu>
                            </div>

                            <div class="resgister-type-container pa-5">
                                <v-select
                                    :items="types"
                                    label="Type"
                                    dense
                                    v-model="editedUser.type"
                                ></v-select>
                                <v-text-field
                                    type="text"
                                    :value="
                                        new Date(editedUser.resgisteredTime)
                                            .toISOString()
                                            .substr(0, 10)
                                    "
                                    label="Registered*"
                                    :disabled="true"
                                    class="registered"
                                />
                            </div>

                            <v-textarea
                                class="d-flex align-center justify-center mt-4 note"
                                outlined
                                name="input-7-4"
                                label="Admin Notes"
                                v-model="editedUser.note"
                            ></v-textarea>
                            <div
                                class="d-flex align-center justify-center mt-4"
                            >
                                <h3 class="mr-6">email verified?</h3>
                                <v-switch
                                    v-model="editedUser.email_verified"
                                    inset
                                    :label="`${editedUser.email_verified}`"
                                ></v-switch>
                            </div>
                        </v-form>
                    </div>
                    <div class="right-side pa-5 d-flex center">
                        <v-select
                            :items="roles"
                            label="Role"
                            dense
                            v-model="editedUser.role"
                        ></v-select>
                    </div>
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
            roles: ['admin', 'user', 'editor'],
            types: ['trial', 'subscribed', 'registered'],
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
};
</script>

<style scoped>
.user-edit-inputs {
    width: 70%;
    margin: 0 auto;
}

img {
    border-radius: 50%;
    position: relative;
    left: 50%;
    transform: translateX(-50%);
}

.left-side {
    width: 100%;
}
.right-side {
    display: flex;
    justify-content: center;
    align-items: center;
    padding-right: 50px;
}

.resgister-type-container {
    display: flex;
    width: 70%;
    margin: 0 auto;
    justify-content: center;
    align-items: center;
}
.registered {
    margin-top: 2px;
    padding-top: 0px;
    padding-left: 10px;
}

.note {
    width: 70%;
    margin: 0 auto;
    padding: 20px;
}

.top-right {
    right: 0;
    position: absolute;
}
</style>