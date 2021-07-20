<template>
  <div>
    <div
      v-if="!loading"
      class="container-width createsub"
    >
      <b-row>
        <b-col
          md="12"
          class="mx-auto d-flex justify-content-center"
        >
          <h1 class="w-100 text-center mb-5">
            Create Subscription
          </h1>
        </b-col>
      </b-row>
      <b-row>
        <b-col cols="3" />
        <b-col cols="6">
          <ValidationObserver
            ref="createFormRef"
            vid="createSubscription"
            tag="div"
            class="px-4"
          >
            <b-form-group
              class="quant-form-group"
              label="Type:"
            >
              <b-input
                value="Overledger Transaction ID"
                class="quant-inputs"
                disabled
              />
            </b-form-group>
            <b-form-group
              class="quant-form-group"
            >
              <ValidationProvider
                v-for="(id, index) in form.ids"
                :ref="`form-id-${index}`"
                :key="index"
                v-slot="{ errors }"
                :rules="{
                  required: true,
                  duplicateValues: [...form.ids],
                }"
                class="plus-input quant-form-group"
                name="Identifier"
                tag="div"
              >
                <b-form-group
                  label="Identifier:"
                >
                  <b-input-group
                    :class="{ 'invalid': errors[0] }"
                  >
                    <b-input
                      :key="index"
                      v-model.trim="form.ids[index]"
                      name="identifier"
                      :class="{'is-invalid': errors[0]}"
                      placeholder="Please Enter"
                      class="quant-inputs"
                      @change="identifierIdChange"
                    />
                    <b-form-invalid-feedback v-if="errors[0]">
                      {{ errors[0] }}
                    </b-form-invalid-feedback>
                    <template #append>
                      <b-button
                        :hidden="index === 0 && form.ids.length === 1"
                        variant="transparent"
                        class="mx-2 btn-minus"
                        @click="removeId(index)"
                      >
                        <span class="icon-minus" />
                      </b-button>
                      <b-button
                        v-if="index === form.ids.length - 1"
                        variant="transparent"
                        class="mx-2 btn-plus"
                        :hidden="!isInputQuantityValid"
                        :disabled="!isIdsValid"
                        @click="addId()"
                      >
                        <span class="icon-plus" />
                      </b-button>
                    </template>
                  </b-input-group>
                </b-form-group>
              </ValidationProvider>
            </b-form-group>
            <ValidationProvider
              v-slot="{ errors }"
              name="Callback URL"
              rules="required"
              tag="div"
            >
              <b-form-group
                class="quant-form-group"
                label="Callback URL:"
              >
                <b-input
                  v-model.trim="form.callbackUrl"
                  class="quant-inputs"
                  name="callback URL"
                  :class="{ 'is-invalid': errors[0] }"
                  placeholder="Please Enter"
                  @change="emitUnsavedData"
                />
                <b-form-invalid-feedback
                  v-if="errors[0]"
                  class="error-message"
                >
                  {{ errors[0] }}
                </b-form-invalid-feedback>
              </b-form-group>
            </ValidationProvider>
            <div class="text-center">
              <b-button
                class="button button-dark button-lg"
                @click="create"
              >
                Create
              </b-button>
            </div>
          </ValidationObserver>
        </b-col>
        <b-col cols="3" />
      </b-row>
    </div>
    <Loading
      v-else
    />
  </div>
</template>

<script>
import { ValidationProvider, ValidationObserver } from 'vee-validate';
import { mapActions } from 'vuex';
import { R_SUBSCRIPTIONS } from '@/router/routes';
import Loading from '@/components/Loading';

export default {
  name: 'CreateSubscriptionView',
  components: {
    Loading,
    ValidationProvider,
    ValidationObserver,
  },
  data() {
    return {
      loading: false,
      form: {
        callbackUrl: '',
        ids: [''],
      },
    };
  },
  computed: {
    ids() {
      return this.$route.params.ids?.length ? this.$route.params.ids : [''];
    },
    isIdsValid() {
      const lengthValid = this.form.ids.every((element) => element.length > 0);
      return lengthValid && this.isInputQuantityValid;
    },
    isInputQuantityValid() {
      return this.form.ids.length < 5;
    },
    hasIdentifierAValue() {
      return this.form.ids.some((element) => element.length > 0);
    },
  },
  created() {
    if (this.ids.length) {
      this.form = {
        ...this.form,
        ids: [...this.ids],
      };
    }
  },
  mounted() {
    this.emitUnsavedData();
  },
  methods: {
    ...mapActions([
      'createSubscription',
      'setChangesState',
    ]),
    create() {
      this.$refs.createFormRef.validate()
        .then(async (success) => {
          if (!success) {
            return;
          }
          this.loading = true;
          this.setChangesState(false);
          await this.createSubscription({
            type: 'overledgerTransactionId',
            callbackUrl: this.form.callbackUrl,
            ids: this.form.ids,
            withDetails: false,
          }).then(() => {
            this.$router.push({ name: R_SUBSCRIPTIONS });
            this.loading = false;
          })
            .catch(() => {
              this.loading = false;
            });
        });
    },
    identifierIdChange() {
      this.validateIdentifierForm();
      this.emitUnsavedData();
    },
    validateIdentifierForm() {
      for (let i = 0; i < this.form.ids.length; i += 1) {
        if (this.$refs[`form-id-${i}`] && this.$refs[`form-id-${i}`].length) {
          this.$refs[`form-id-${i}`][0].validate();
        }
      }
    },
    addId() {
      if (this.isIdsValid) {
        this.form.ids.push('');
      }
    },
    removeId(index) {
      this.form.ids.splice(index, 1);
      this.identifierIdChange();
    },
    emitUnsavedData() {
      const hasChanges = this.hasIdentifierAValue || !!this.form.callbackUrl;
      this.setChangesState(hasChanges);
    },
  },
};
</script>
