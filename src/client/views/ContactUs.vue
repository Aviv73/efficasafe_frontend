<template>
  <section class="contact-us">
    <div class="contact-us-container side-by-side-container">
      <span class="brim-start" />
      <header>
        <router-link to="/">
          <img
            :src="require('@/client/assets/imgs/flat-logo.png')"
            alt="Logo"
          />
        </router-link>
        <h2 class="heading1">Contact us</h2>
        <p>
          <span class="d-block">
            We are here to answer any questions you may have.
          </span>
          Reach out to us by completing the form below and we'll respond as soon
          as we can.
        </p>
      </header>
      <main>
        <validation-observer v-slot="{ handleSubmit, reset }">
          <form
            class="contact-us-form"
            @submit.prevent="handleSubmit(onSubmit)"
            @reset="reset"
            novalidate
          >
            <validation-provider>
              <div class="form-input">
                <label for="">
                  <input
                    type="text"
                    placeholder="First Name"
                    v-model="userDetails.firstName"
                  />
                  <span class="label">First Name</span>
                </label>
              </div>
            </validation-provider>
            <validation-provider>
              <div class="form-input">
                <label for="">
                  <input
                    type="text"
                    placeholder="Last Name"
                    v-model="userDetails.lastName"
                  />
                  <span class="label">Last Name</span>
                </label>
              </div>
            </validation-provider>
            <validation-provider
              rules="required|email"
              v-slot="{ errors }"
              :custom-messages="validationMessages"
            >
              <div
                class="form-input"
                :class="{ 'is-invalid': !!errors.length }"
              >
                <label for="">
                  <input
                    type="text"
                    placeholder="Email"
                    v-model="userDetails.email"
                  />
                  <span class="label">Email</span>
                </label>
              </div>
              <div class="user-edit-error-msg font-bold" v-if="errors.length">
                {{ errors[0] }}
              </div>
            </validation-provider>
            <validation-provider>
              <div class="form-input last-input-form">
                <label for="">
                  <input
                    type="text"
                    placeholder="Phone"
                    v-model="userDetails.phone"
                    ref="phoneInput"
                    @countrychange="setPhoneDialCode"
                  />
                  <span class="label">Phone</span>
                </label>
              </div>
            </validation-provider>

              <custom-select
                class="contact-us-custom-select"
                :class="{ 'is-invalid': selectError }"
                placeholder="Inquiry type"
                :options="selectOptions"
                v-model="userDetails.type"
                ref="customSelect"
                @changed="selectError = false"
              >
              </custom-select>

            <validation-provider
              rules="required"
              v-slot="{ errors }"
              :custom-messages="validationMessages"
            >
              <textarea
                v-model="userDetails.msg"
                placeholder="Message"
                rows="10"
                :class="{ 'is-invalid': !!errors.length }"
              />
              <div class="user-edit-error-msg font-bold" v-if="errors.length">
                {{ errors[0] }}
              </div>
            </validation-provider>

            <span class="contact-us-checkbox-container">
              <checkbox
                class="contact-us-checkbox"
                v-model="userDetails.isWantNews"
              >
              </checkbox>
              <p>efficasafe can send me news and updates</p>
            </span>

            <button class="btn contact-us-button" type="submit">Submit</button>
            <div class="user-edit-error-msg font-bold" v-if="selectError">
                Inquiry type is required
            </div>
          </form>
        </validation-observer>
      </main>
      <span class="brim-end" />
    </div>
  </section>
</template>

<script>
import { ValidationProvider, ValidationObserver } from "vee-validate";
import CustomSelect from "@/client/cmps/common/CustomSelect";
import Checkbox from "@/client/cmps/common/Checkbox";
import { httpService } from "@/cms/services/http.service";
import intlTelInput from "intl-tel-input";
import { eventBus, EV_show_user_msg } from '@/cms/services/eventBus.service';

export default {
  data() {
    return {
      userDetails: {
        firstName: "",
        lastName: "",
        email: "",
        phone: "",
        type: "",
        msg: "",
        isWantNews: false,
      },
      selectOptions: [
        {
          title: "customer support (subscriptions, payment, etc.)",
          value: "customer support (subscriptions, payment, etc.)",
        },
        { title: "professional question", value: "professional question" },
        { title: "report an interaction", value: "report an interaction" },
        { title: "Other", value: "Other" },
      ],
      validationMessages: {
        email: "email not valid",
        required: "Field is required",
      },
      selectError: false,
    };
  },
  computed: {
    loggedInUser() {
      return this.$store.getters.loggedInUser;
    },
  },
  methods: {
    async onSubmit() {
      if (!this.userDetails.type) {
        this.selectError = true;
        return;
      }
      this.checkPhoneIntlValid();
      try{
          await httpService.post('task', this.userDetails)
          eventBus.$emit(EV_show_user_msg, 'Email was Sent', 3000, 'success')  

      }catch(err){
          eventBus.$emit(EV_show_user_msg, 'Shomting went wrong', 3000, 'error')
      }
    },
    setPhoneDialCode() {
      this.userDetails.phone = this.$refs.phoneInput.value;
    },
    checkPhoneIntlValid() {
      if (this.userDetails.phone && !this.userDetails.phone.startsWith("+")) {
        this.userDetails.phone = `+1 ${this.userDetails.phone}`;
      }
    },
    onSelectChange() {
      this.$refs.customSelect.classList.remove("is-invalid");
    },
  },
  mounted() {
    this.iti = intlTelInput(this.$refs.phoneInput, {
      nationalMode: false,
    });
  },
  created() {
    const user = this.loggedInUser;
    if (user) {
      this.userDetails.email = user.email;
      this.userDetails.firstName = user.given_name || "";
      this.userDetails.lastName = user.family_name || "";
      this.userDetails.phone = user.phone || "";
    }
  },
  components: {
    ValidationObserver,
    ValidationProvider,
    CustomSelect,
    Checkbox,
  },
};
</script>
