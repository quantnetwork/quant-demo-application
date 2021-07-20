<template>
  <div>
    <b-row>
      <b-col
        md="12"
        class="mx-auto d-flex justify-content-center font-weight-bold"
      >
        <h1 class="w-100 text-center">
          Create Transaction
        </h1>
      </b-col>
    </b-row>
    <b-row class="d-flex justify-content-center trans-header">
      <b-col
        class="quant-form-group mr-3"
        cols="6"
      >
        <label class="quant-label">DLT:</label>
        <b-button
          v-if="isAuditTransaction"
          v-b-modal:modal-overledger-transaciton
          size="sm"
          variant="link"
          class="p-0 button-view"
        >
          View Details
        </b-button>
        <multiselect
          v-model="dltType"
          :options="dltTypeOptions"
          :disabled="isAuditTransaction"
          label="label"
          value="value"
          track-by="value"
          selected-label=""
          name
          placeholder="Please Select"
          :option-height="50"
          @input="handleInput(!isAuditTransaction)"
          @select="handleSelect(!isAuditTransaction)"
        >
          <template
            slot="singleLabel"
            slot-scope="{ option }"
          >
            <span :class="[option.icon]" />
            <span>
              {{ option.label }}
            </span>
          </template>
          <template
            slot="option"
            slot-scope="{ option }"
          >
            <span :class="[option.icon]" />
            {{ option.label }}
          </template>
        </multiselect>
      </b-col>
      <b-col
        v-if="isLinkedTransaction"
        class="quant-form-group"
        :cols="isLinkedTransaction ? 6 : 12"
      >
        <label class="quant-label">Audit To:</label>
        <multiselect
          v-model="auditType"
          :options="dltTypeOptions"
          label="label"
          value="value"
          track-by="value"
          selected-label=""
          name
          placeholder="Please Select"
          :option-height="50"
          @input="handleInput(isAuditTransaction)"
          @select="handleSelect(isAuditTransaction)"
        >
          <template
            slot="singleLabel"
            slot-scope="{ option }"
          >
            <span :class="[option.icon]" />
            <span>
              {{ option.label }}
            </span>
          </template>
          <template
            slot="option"
            slot-scope="{ option }"
          >
            <span :class="[option.icon]" />
            {{ option.label }}
          </template>
        </multiselect>
      </b-col>
    </b-row>
    <ValidationObserver
      v-if="showForm"
      :ref="formRef"
      vid="createTransaction"
      tag="div"
      class="px-4"
    >
      <div class="m-t-10 text-center secondary-header d-flex justify-content-center">
        <p>Transaction Details</p>
        <i
          v-b-popover.hover.top="{
            customClass: 'my-popover-class',
            content: ' Please note that in case of changing the' +
              ' DLT, the data you entered will be reset.' }"
          class="info-field"
        >
          <span class="icon-info" />
        </i>
      </div>
      <b-row>
        <b-col md="4">
          <div class="multiselect-group">
            <label class="quant-label">Type:</label>
            <b-input
              class="quant-inputs"
              :value="form.type"
              disabled
            />
          </div>
          <div class="multiselect-group">
            <label class="quant-label">Technology:</label>
            <b-input
              class="quant-inputs"
              :value="dltTypeResolved.value"
              disabled
            />
          </div>
          <div class="multiselect-group">
            <label class="quant-label">Network:</label>
            <b-input
              class="quant-inputs"
              :value="form.network"
              disabled
            />
          </div>
        </b-col>
        <b-col md="4">
          <div class="multiselect-group">
            <ValidationProvider
              v-slot="{ errors }"
              rules="required"
              name="Origin ID"
              vid="originId"
              tag="div"
            >
              <label class="quant-label">Origin ID:</label>
              <b-form-input
                v-model="form.originId"
                class="quant-inputs"
                :class="{ 'is-invalid': errors[0] }"
                placeholder="Please Enter"
                trim
              />
              <b-form-invalid-feedback
                v-if="errors[0]"
                class="error-message"
              >
                {{ errors[0] }}
              </b-form-invalid-feedback>
            </ValidationProvider>
          </div>
          <div class="multiselect-group">
            <ValidationProvider
              v-slot="{ errors }"
              rules="required"
              name="Destination ID"
              vid="destinationId"
              tag="div"
            >
              <label class="quant-label">Destination ID:</label>
              <b-form-input
                v-model="form.destinationId"
                class="quant-inputs"
                :class="{ 'is-invalid': errors[0] }"
                placeholder="Please Enter"
                trim
              />
              <b-form-invalid-feedback
                v-if="errors[0]"
                class="error-message"
              >
                {{ errors[0] }}
              </b-form-invalid-feedback>
            </ValidationProvider>
          </div>
          <div class="multiselect-group">
            <label class="quant-label">Urgency:</label>
            <b-input
              class="quant-inputs"
              :value="form.urgencyLabel"
              disabled
            />
          </div>
        </b-col>
        <b-col md="4">
          <div class="multiselect-group">
            <ValidationProvider
              v-if="isEthereum"
              v-slot="{ errors }"
              :rules="formConfiguration.amountValidationRules"
              name="Total Payment Amount"
              vid="totalPaymentAmount"
              tag="div"
            >
              <label class="quant-label">Total Payment Amount:</label>
              <div class="unit-wrapper">
                <b-form-input
                  v-model="form.totalPaymentAmount"
                  class="quant-inputs"
                  :class="{ 'is-invalid': errors[0] }"
                  placeholder="Please Enter"
                  trim
                />
                <p>{{ formConfiguration.unit }}</p>
              </div>
              <b-form-invalid-feedback
                v-if="errors[0]"
                class="error-message"
              >
                {{ errors[0] }}
              </b-form-invalid-feedback>
            </ValidationProvider>
            <ValidationProvider
              v-else
              v-slot="{ errors }"
              :rules="formConfiguration.amountValidationRules"
              :custom-messages="formConfiguration.customMessages"
              name="Destination Amount"
              vid="destinationAmount"
              tag="div"
            >
              <label class="quant-label">Destination Amount:</label>
              <div class="unit-wrapper">
                <b-form-input
                  v-model="form.destinationAmount"
                  class="quant-inputs"
                  :class="{ 'is-invalid': errors[0] }"
                  placeholder="Please Enter"
                  trim
                />
                <p>{{ formConfiguration.unit }}</p>
              </div>
              <b-form-invalid-feedback
                v-if="errors[0]"
                class="error-message"
              >
                {{ errors[0] }}
              </b-form-invalid-feedback>
            </ValidationProvider>
          </div>
          <div class="multiselect-group">
            <ValidationProvider
              v-slot="{ errors }"
              :rules="{ max: 256 }"
              name="Message"
              vid="message"
              tag="div"
            >
              <label class="quant-label">Message (Optional):</label>
              <b-form-textarea
                v-model.trim="form.message"
                class="quant-inputs"
                placeholder="Please Enter"
                :class="{ 'is-invalid': errors[0] }"
                rows="5"
                max-rows="5"
                no-resize
              />
              <b-form-invalid-feedback
                v-if="errors[0]"
                class="error-message"
              >
                {{ errors[0] }}
              </b-form-invalid-feedback>
            </ValidationProvider>
          </div>
        </b-col>
      </b-row>
      <b-row>
        <b-col
          md="3"
          class="mx-auto d-flex justify-content-center font-weight-bold mt-4"
        >
          <b-button
            class="button w-100 button-lg button-dark"
            :disabled="buttonDisabled"
            @click="handleSubmit"
          >
            Create
          </b-button>
        </b-col>
      </b-row>
    </ValidationObserver>
    <b-modal
      v-if="isAuditTransaction"
      id="modal-overledger-transaciton"
      v-model="showDetailsModal"
      title="Overledger Transaction"
      size="lg"
      ok-only
      ok-variant="secondary"
      centered
      lazy
    >
      <TransactionDetails
        :data="mappedPreviousOverledgerTransactionData"
        :show-title="false"
      />
      <template #modal-footer>
        <b-button
          class="button button-light button-modal"
          @click="showDetailsModal = false"
        >
          Close
        </b-button>
      </template>
    </b-modal>
  </div>
</template>

<script>
import Multiselect from 'vue-multiselect';
import { ValidationProvider, ValidationObserver } from 'vee-validate';
import {
  ETHEREUM, BITCOIN, XRP_LEDGER, ETHEREUM_UNIT, BITCOIN_UNIT, XRP_UNIT,
} from '@/constants/dltOptions/dltTypes';
import { mapOverledgerTransactionDataMethod } from '@/helpers/helper';
import TransactionDetails from '@/components/TransactionDetails';

const formRef = 'create-transaction-ref';

const defaultForm = {
  type: 'PAYMENT',
  technology: null,
  network: null,
  urgency: 'normal',
  urgencyLabel: 'Normal',
  totalPaymentAmount: null,
  originId: null,
  destinationId: null,
  destinationAmount: null,
  message: '',
};

export default {
  name: 'CreateTransaction',
  components: {
    Multiselect,
    ValidationProvider,
    ValidationObserver,
    TransactionDetails,
  },
  props: {
    buttonDisabled: {
      type: Boolean,
      default: false,
    },
    isLinkedTransaction: {
      type: Boolean,
      default: false,
    },
    isAuditTransaction: {
      type: Boolean,
      default: false,
    },
    previousTransaction: {
      type: Object,
      default: () => {},
    },
    auditTypeValue: {
      type: String,
      default: '',
    },
  },
  data() {
    return {
      form: {
        ...defaultForm,
      },
      dltType: {},
      auditType: {},
      formRef,
      showDetailsModal: false,
    };
  },
  computed: {
    dltTypeOptions() {
      return [
        {
          label: BITCOIN,
          value: BITCOIN,
          icon: 'icon-bitcoin',
        },
        {
          label: ETHEREUM,
          value: ETHEREUM,
          icon: 'icon-eth',
        },
        {
          label: XRP_LEDGER,
          value: XRP_LEDGER,
          icon: 'icon-xrp',
        },
      ];
    },
    formConfiguration() {
      let configs = {
        amountValidationRules: {},
        unit: '',
        networkOptions: [],
      };
      switch (this.dltTypeResolved.value) {
        case ETHEREUM:
          configs = {
            amountValidationRules: {
              decimalValidator: { digits: 3, decimals: 18 },
            },
            unit: ETHEREUM_UNIT,
            networkOptions: ['Ropsten TestNet'],
          };
          break;
        case BITCOIN:
          configs = {
            amountValidationRules: {
              decimalValidator: { digits: 3, decimals: 8 },
              min_value: 0.00000001,
            },
            customMessages: {
              min_value: 'The Destination Amount must be 0.00000001 or more.',
            },
            unit: BITCOIN_UNIT,
            networkOptions: ['Testnet'],
          };
          break;
        case XRP_LEDGER:
          configs = {
            amountValidationRules: {
              decimalValidator: { digits: 3, decimals: 6 },
              min_value: 0.000001,
            },
            customMessages: {
              min_value: 'The Destination Amount must be 0.000001 or more.',
            },
            unit: XRP_UNIT,
            networkOptions: ['Testnet'],
          };
          break;
        default:
          break;
      }
      return {
        ...configs,
        amountValidationRules: {
          required: true,
          ...configs.amountValidationRules,
        },
      };
    },
    isEthereum() {
      return this.dltTypeResolved.value === ETHEREUM;
    },
    dltTypeResolved() {
      if (this.isAuditTransaction) {
        return this.auditType;
      }
      return this.dltType;
    },
    showForm() {
      if (this.isLinkedTransaction) {
        return this.auditType?.value && this.dltType?.value;
      }
      return this.dltType?.value;
    },
    mappedPreviousOverledgerTransactionData() {
      return mapOverledgerTransactionDataMethod(this.previousTransaction);
    },
  },
  created() {
    if (this.isLinkedTransaction) {
      if (this.auditTypeValue) {
        this.auditType = this.dltTypeOptions.find((el) => el.value === this.auditTypeValue);
      }
      const technology = this.previousTransaction?.location?.technology || '';
      const transactionId = this.previousTransaction?.overledgerTransactionDetails?.transactionId || ' ';
      this.form.message = transactionId || ' ';
      if (technology) {
        this.dltType = this.dltTypeOptions.find((el) => el.value === technology);
      }
      this.form = {
        ...this.form,
        network: this.formConfiguration.networkOptions[0],
      };
      this.emitUnsavedData();
    }
  },
  methods: {
    handleInput(set) {
      this.emitUnsavedData();
      if (set) {
        this.form = {
          ...defaultForm,
        };
        if (this.$refs[formRef]) {
          this.$refs[formRef].reset();
        }
      }
    },
    handleSubmit() {
      this.$refs[formRef].validate()
        .then((success) => {
          if (!success) {
            return;
          }
          const mappedForm = {
            auditType: this.isLinkedTransaction ? this.auditType.value : null,
            type: this.form.type,
            location: {
              technology: this.dltTypeResolved.value,
              network: this.form.network,
            },
            urgency: this.form.urgency,
            requestDetails: {
              message: this.form.message || ' ',
              origin: [
                {
                  originId: this.form.originId,
                },
              ],
              destination: [
                {
                  destinationId: this.form.destinationId,
                  payment: {
                    amount: !this.isEthereum ? this.form.destinationAmount
                      : this.form.totalPaymentAmount,
                    unit: this.formConfiguration.unit,
                  },
                },
              ],
            },
          };
          this.$emit('unsaved-data-change', false);
          this.$emit('submit-transaction', mappedForm);
        });
    },
    handleSelect(set) {
      if (set) {
        this.$nextTick(() => {
          this.form = {
            ...this.form,
            network: this.formConfiguration.networkOptions[0],
          };
          this.form.message = this.previousTransaction
            ?.overledgerTransactionDetails?.transactionId || ' ';
        });
      }
    },
    emitUnsavedData() {
      const hasChanges = Boolean(this.auditType?.value || this.dltType?.value);
      this.$emit('unsaved-data-change', hasChanges);
    },
  },
};
</script>
