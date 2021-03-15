<template>
  <div>
    <v-row dense>
      <v-col class="pa-0" cols="6" xl="6" lg="6" md="6" sm="6">
        <v-card style="min-height: calc(100vh - 148px)">
          <v-toolbar elevation-1 flat color="primary" width="auto">
            <v-btn fab text small dark @click="prev">
              <v-icon small>mdi-chevron-left</v-icon>
            </v-btn>
            <v-btn fab text small dark @click="next">
              <v-icon small>mdi-chevron-right</v-icon>
            </v-btn>
            <v-btn
              outlined
              dark
              class="mr-4"
              x-small
              @click="setToday({ date })"
            >
              Today
            </v-btn>
            <v-toolbar-title
              ><span class="font-weight-medium" style="color:white">{{
                title
              }}</span></v-toolbar-title
            >
            <div class="flex-grow-1"></div>
            <v-spacer></v-spacer>
            <v-switch
              class="mr-0 pt-6"
              @change="getFilteredEvent()"
              dark
              v-model="switch1"
              inset
              :label="`HISTORY`"
            ></v-switch>
          </v-toolbar>
          <v-sheet :height="screenHeight * 0.62">
            <v-calendar
              class="calendar"
              ref="calendar"
              v-model="focus"
              event-timed
              :events="schedules"
              :event-overlap-mode="mode"
              :event-overlap-threshold="30"
              :event-color="getEventColor"
              :event-margin-bottom="2"
              :type="type"
              @click:event="viewDay"
              @click:more="viewDay"
              @change="updateRange"
              @click:day="viewDay"
              @click:date="addSched"
              color="primary"
            >
            </v-calendar>
          </v-sheet>
        </v-card>
      </v-col>
      <v-col class="pa-0" cols="6" xl="6" lg="6" md="6" sm="6">
        <v-card
          elevation="1"
          flat
          class="scroll"
          style="max-height: calc(100vh - 148px)"
        >
          <template v-for="(sched, i) in filteredSchedules">
            <v-card :key="i + 'a'" tile max-height="400">
              <v-list-item>
                <v-list-item-content class="pa-0">
                  <v-row dense>
                    <v-col cols="3">
                      <span class="font-weight-black body-2">Title: </span>
                      <span
                        class="font-weight-medium body-2"
                        :style="`color:${sched.companyColor}`"
                        >{{ sched.name }}</span
                      >
                      <br />
                      <span class="overline"
                        >Date:
                        <span class="font-weight-black caption">{{
                          sched.start
                        }}</span></span
                      >
                      <br />
                      <template v-if="sched.timeFrom">
                        <span class="overline"
                          >From:
                          <span class="font-weight-black ">{{
                            sched.timeFrom
                          }}</span></span
                        >
                      </template>

                      <br />

                      <template v-if="sched.timeTo">
                        <span class="overline"
                          >To:
                          <span class="font-weight-black">{{
                            sched.timeTo
                          }}</span></span
                        >
                      </template>

                      <br />

                      <template v-if="sched.mrfNo">
                        <span class="overline"
                          >MRF No.:
                          <span class="font-weight-black">{{
                            sched.mrfNo
                          }}</span></span
                        >
                      </template>

                      <br />
                      <span class="caption">{{ sched.employee_code }}</span>
                      <br />
                      <span class="caption"
                        >Reserved by: <br />
                        {{ sched.reservedBy }}</span
                      >
                    </v-col>
                    <v-divider class="mx-4" vertical></v-divider>
                    <v-col cols="4">
                      <span class="caption">Attendees:</span>
                      <span
                        v-for="(item, i) in sched.selectedName"
                        class="caption"
                        :key="i + 'a'"
                        ><br />{{ item.text || item }}</span
                      >
                      <br />
                      <v-divider></v-divider>
                      <span class="caption">Requesting to join:</span>
                      <span
                        v-for="(item, i) in sched.requestingName"
                        class="caption"
                        :key="i + 'b'"
                        ><br />{{ item }}</span
                      >
                    </v-col>
                    <v-col cols="3">
                      <span class="caption"
                        >Description: <br />{{ sched.info }}</span
                      >
                    </v-col>
                  </v-row>
                </v-list-item-content>
                <v-list-item-action>
                  <v-row dense>
                    <v-col cols="12">
                      <template
                        v-if="
                          sched.reservedBy ===
                            $store.state.users.info.EmployeeName ||
                            (sched.reservedBy ===
                              $store.state.users.info.FirstNameEng +
                                ' ' +
                                $store.state.users.info.LastNameEng &&
                              sched.start >= date)
                        "
                      >
                        <v-btn @click="editEvent(sched)" icon>
                          <v-icon>mdi-pencil</v-icon>
                        </v-btn>
                        <v-btn @click="deleteEvent(sched, i)" icon>
                          <v-icon>mdi-delete</v-icon>
                        </v-btn>
                      </template>
                      <br />
                      <br />

                      <template v-if="!$store.state.users.isJA">
                        <v-btn
                          v-show="sched.start >= date"
                          class="pl-1"
                          outlined
                          small
                          :disabled="
                            sched.requestingName.includes(
                              $store.state.users.info.EmployeeName,
                            ) ||
                              sched.selectedName.some(
                                i =>
                                  i.text ==
                                  $store.state.users.info.EmployeeName,
                              )
                          "
                          max-width="100px"
                          color="success"
                          @click="joinSched(sched, i)"
                        >
                          <v-icon v-text="'mdi-account-plus-outline'" />

                          <template
                            v-if="
                              sched.requestingName.includes(
                                $store.state.users.info.EmployeeName,
                              ) ||
                                sched.selectedName.some(
                                  i =>
                                    i.text ==
                                    $store.state.users.info.EmployeeName,
                                )
                            "
                          >
                            Joined
                          </template>
                          <template v-else>
                            Join
                          </template>
                        </v-btn>
                      </template>

                      <template v-else>
                        <v-btn
                          v-show="sched.start >= date"
                          class="pl-1"
                          outlined
                          small
                          :disabled="
                            sched.requestingName.includes(
                              $store.state.users.info.FirstNameEng +
                                ' ' +
                                $store.state.users.info.LastNameEng,
                            ) ||
                              sched.selectedName.some(
                                i =>
                                  i.text ==
                                  $store.state.users.info.FirstNameEng +
                                    ' ' +
                                    $store.state.users.info.LastNameEng,
                              )
                          "
                          max-width="100px"
                          color="success"
                          @click="joinSched(sched, i)"
                        >
                          <v-icon v-text="'mdi-account-plus-outline'" />

                          <template
                            v-if="
                              sched.requestingName.includes(
                                $store.state.users.info.FirstNameEng +
                                  ' ' +
                                  $store.state.users.info.LastNameEng,
                              ) ||
                                sched.selectedName.some(
                                  i =>
                                    i.text ==
                                    $store.state.users.info.FirstNameEng +
                                      ' ' +
                                      $store.state.users.info.LastNameEng,
                                )
                            "
                          >
                            Joined
                          </template>
                          <template v-else>
                            Join
                          </template>
                        </v-btn>
                      </template>

                      <br />
                      <br />
                      <template v-if="!$store.state.users.isJA">
                        <template
                          v-if="
                            sched.requestingName.indexOf(
                              $store.state.users.info.EmployeeName,
                            ) !== -1
                          "
                        >
                          <v-btn
                            class="pl-1"
                            outlined
                            small
                            color="red"
                            @click="cancelSched(sched, i)"
                          >
                            <v-icon>mdi-account-remove-outline</v-icon>
                            <span class="overline">Cancel</span>
                          </v-btn>
                        </template>
                      </template>
                      <template v-else>
                        <template
                          v-if="
                            sched.requestingName.indexOf(
                              $store.state.users.info.FirstNameEng +
                                ' ' +
                                $store.state.users.info.LastNameEng,
                            ) !== -1
                          "
                        >
                          <v-btn
                            class="pl-1"
                            outlined
                            small
                            color="red"
                            @click="cancelSched(sched, i)"
                          >
                            <v-icon>mdi-account-remove-outline</v-icon>
                            <span class="overline">Cancel</span>
                          </v-btn>
                        </template>
                      </template>
                    </v-col>
                  </v-row>
                </v-list-item-action>
              </v-list-item>
            </v-card>
          </template>
        </v-card>
      </v-col>
    </v-row>
    <v-row dense class="fill-height pa-0 ma-0">
      <v-col cols="12" md="8" sm="6">
        <span>Legend:</span>
        <template v-for="(sec, j) in companies">
          <v-btn
            :key="j + 'b'"
            :color="sec.color"
            x-small
            depressed
            class="ma-2 disable-events"
            >{{ sec.text }}</v-btn
          >
        </template>
        <v-btn color="#696969" x-small depressed class="ma-2 disable-events"
          >JA</v-btn
        >
      </v-col>
    </v-row>
    <v-row class="justify-center">
      <v-dialog v-model="dialog" max-width="700px" persistent>
        <v-card>
          <v-toolbar color="primary" flat dense dark>
            <v-toolbar-title class="headline font-weight-light">{{
              titleName
            }}</v-toolbar-title>
            <v-spacer></v-spacer>

            <v-btn @click="closeDialog()" fab outlined x-small dark>
              <v-icon>mdi-close</v-icon>
            </v-btn>
          </v-toolbar>
          <v-card-text>
            <v-form ref="form" v-model="valid" lazy-validation>
              <v-row>
                <v-col class="px-1" cols="12" sm="8" md="4">
                  <v-text-field
                    class="pt-3"
                    hide-details
                    outlined
                    dense
                    v-model="toAdd.name"
                    :rules="nameRules"
                    label="Event Title"
                    required
                  ></v-text-field>
                </v-col>
                <v-col class="pl-8" cols="12" sm="8" md="4">
                  <v-text-field
                    class="pt-3"
                    hide-details
                    outlined
                    dense
                    v-model="toAdd.mrfNo"
                    label="MRF No."
                    required
                  ></v-text-field>
                </v-col>

                <v-spacer></v-spacer>
                <template v-if="this.editedIndex > -1">
                  <v-col class="px-1" cols="12" sm="8" md="4">
                    <v-dialog
                      ref="dialog"
                      v-model="modal"
                      :return-value.sync="toAdd.date"
                      persistent
                      width="290px"
                    >
                      <template v-slot:activator="{ on }">
                        <v-text-field
                          v-model="toAdd.start"
                          v-on="on"
                          label="Start Date"
                          prepend-icon="mdi-calendar"
                          readonly
                        >
                        </v-text-field>
                      </template>
                      <v-date-picker
                        v-model="toAdd.start"
                        :min="date"
                        scrollable
                      >
                        <v-spacer></v-spacer>
                        <v-btn text color="primary" @click="modal = false"
                          >Cancel</v-btn
                        >
                        <v-btn
                          text
                          color="primary"
                          @click="$refs.dialog.save(toAdd.date)"
                          >Ok</v-btn
                        >
                      </v-date-picker>
                    </v-dialog>
                  </v-col>
                </template>
                <template v-else>
                  <v-col class="pl-6" cols="12" sm="4">
                    <div class="pt-3">
                      <v-btn
                        outlined
                        color="green"
                        rounded
                        @click="recurringEvents()"
                      >
                        <v-icon color="green">mdi-autorenew</v-icon>
                        <span class="font-weight-light"> Repeat</span>
                      </v-btn>
                    </div>
                  </v-col>
                </template>
                <v-dialog v-model="recurringDialog" persistent max-width="670">
                  <v-card outlined>
                    <v-card-title class="headline">Event Series</v-card-title>
                    <v-card-text>
                      <v-row>
                        <v-col cols="7">
                          <v-select
                            hide-details
                            label="Repeat"
                            v-model="occur"
                            :items="recurringOptions"
                          >
                          </v-select>
                        </v-col>
                        <template v-if="occur">
                          <v-col v-if="occur === 'Daily'" cols="5">
                            <v-text-field
                              type="number"
                              hide-details
                              v-model.number="repeatDay"
                              label="Repeat every"
                              suffix="Day(s)"
                            >
                            </v-text-field>
                          </v-col>
                          <v-col v-if="occur === 'Weekly'" cols="5">
                            <v-text-field
                              type="number"
                              hide-details
                              v-model.number="repeatWeek"
                              label="Repeat every"
                              suffix="Week(s)"
                            >
                            </v-text-field>
                          </v-col>
                          <v-col v-if="occur === 'Monthly'" cols="5">
                            <v-text-field
                              type="number"
                              hide-details
                              v-model.number="repeatMonth"
                              label="Repeat every"
                              suffix="Month(s)"
                            >
                            </v-text-field>
                          </v-col>
                        </template>
                        <v-col cols="12" class="py-0">
                          <template v-if="occur !== 'Never'">
                            <v-divider class="mr-1"></v-divider>
                          </template>
                        </v-col>
                        <template v-if="occur !== 'Never'">
                          <v-col cols="4">
                            <v-select
                              v-model="endDefaultOps"
                              label="End"
                              :items="endOptions"
                            ></v-select>
                          </v-col>
                          <v-col cols="8" v-if="endDefaultOps !== 'Count'">
                            <v-menu
                              ref="menu"
                              v-model="menu"
                              :return-value.sync="dateUntil"
                              transition="scale-transition"
                              offset-y
                              min-width="290px"
                              :close-on-content-click="false"
                            >
                              <template
                                v-slot:activator="{
                                  on,
                                }"
                              >
                                <v-text-field
                                  v-model="toAdd.end"
                                  hide-details
                                  v-on="on"
                                  append-icon="mdi-calendar"
                                  readonly
                                >
                                </v-text-field>
                              </template>
                              <v-date-picker
                                v-model="toAdd.end"
                                no-title
                                :min="date"
                              >
                                <v-spacer></v-spacer>
                                <v-btn
                                  text
                                  color="primary"
                                  @click="menu = false"
                                  >Cancel</v-btn
                                >
                                <v-btn
                                  text
                                  color="primary"
                                  @click="$refs.menu.save(dateUntil)"
                                  >Ok</v-btn
                                >
                              </v-date-picker>
                            </v-menu>
                          </v-col>
                          <v-col cols="4" v-else>
                            <v-text-field
                              type="number"
                              hide-details
                              v-model="countNumbers"
                            >
                            </v-text-field>
                          </v-col>
                        </template>
                        <v-col cols="12" class="py-0">
                          <template v-if="occur !== 'Never'">
                            <v-divider class="mr-1"></v-divider>
                          </template>
                        </v-col>

                        <v-col
                          cols="12"
                          class="ma-0 pa-0"
                          v-if="occur === 'Weekly'"
                        >
                          <span class="ml-2">Repeat On</span>
                          <div class="row ml-0 pa-0">
                            <template v-for="(item, i) in weekday">
                              <v-checkbox
                                v-model="weekDayNow"
                                color="primary"
                                multiple
                                class="compact-form space-around"
                                dense
                                hide-details
                                :key="i + 'b'"
                                :label="item.text"
                                :value="item.value"
                              ></v-checkbox>
                            </template>
                          </div>
                        </v-col>

                        <v-col
                          cols="12"
                          class="ma-0 pa-0"
                          v-if="occur === 'Daily'"
                        >
                          <span class="ml-2">Except On</span>
                          <div class="row ml-0 pa-0">
                            <template v-for="(item, i) in weekday">
                              <v-checkbox
                                v-model="weekDailyNow"
                                color="primary"
                                multiple
                                class="compact-form space-around"
                                dense
                                hide-details
                                :key="i + 'b'"
                                :label="item.text"
                                :value="item.value"
                              ></v-checkbox>
                            </template>
                          </div>
                        </v-col>

                        <template v-if="occur === 'Monthly'">
                          <v-col cols="4">
                            <v-select
                              hide-details
                              v-model="monthlyOpsDefault"
                              label="End"
                              :items="monthlyOps"
                              :item-text="monthlyOps.text"
                              :item-value="monthlyOps.value"
                            ></v-select>
                          </v-col>
                          <v-col cols="4">
                            <v-select
                              hide-details
                              v-model="weekDayNow"
                              label="Repeat On"
                              :items="weekday"
                              :item-text="weekday.text"
                              :item-value="weekday.value"
                            ></v-select>
                          </v-col>
                        </template>
                      </v-row>
                    </v-card-text>
                    <v-card-actions>
                      <v-spacer></v-spacer>
                      <v-btn
                        color="green darken-1"
                        text
                        @click="closeRecurring()"
                      >
                        Cancel
                      </v-btn>
                      <v-btn
                        color="green darken-1"
                        text
                        v-if="occur === 'Daily'"
                        @click="
                          dailyRepeat(
                            toAdd.start,
                            toAdd.end,
                            weekDailyNow,
                            repeatDay,
                            countNumbers,
                          )
                        "
                      >
                        Save
                      </v-btn>
                      <v-btn
                        color="red"
                        text
                        v-if="occur === 'Weekly'"
                        @click="
                          weeklyRepeat(
                            toAdd.start,
                            toAdd.end,
                            repeatDay,
                            weekDayNow,
                            countNumbers,
                          )
                        "
                      >
                        Save
                      </v-btn>
                      <v-btn
                        color="primary"
                        text
                        v-if="occur === 'Monthly'"
                        @click="
                          monthlyRepeat(
                            toAdd.start,
                            toAdd.end,
                            monthlyOpsDefault,
                            repeatDay,
                            weekDayNow,
                            countNumbers,
                          )
                        "
                      >
                        Save
                      </v-btn>
                    </v-card-actions>
                  </v-card>
                </v-dialog>
                <v-col class="px-1" cols="4">
                  <v-autocomplete
                    outlined
                    dense
                    class="font-weight-light caption"
                    v-model="toAdd.selectedCompany"
                    :items="companies"
                    item-text="text"
                    item-value="value"
                    hide-details
                    @change="
                      getDepartments()
                      toAdd.selectedDepartment = ''
                    "
                    label="Company"
                    autocomplete="off"
                  ></v-autocomplete>
                </v-col>
                <v-col class="px-1" cols="4">
                  <v-autocomplete
                    outlined
                    dense
                    class="font-weight-light caption"
                    v-model="toAdd.selectedDepartment"
                    :items="departments"
                    item-text="text"
                    item-value="value"
                    hide-details
                    @change="
                      getSections()
                      toAdd.selectedSection = ''
                    "
                    label="Department"
                    autocomplete="off"
                  ></v-autocomplete>
                </v-col>
                <v-col class="px-1" cols="4">
                  <v-autocomplete
                    outlined
                    dense
                    class="font-weight-light caption"
                    v-model="toAdd.selectedSection"
                    :items="sections"
                    item-text="text"
                    item-value="value"
                    hide-details
                    @change="getEmployees()"
                    label="Section"
                    autocomplete="off"
                  ></v-autocomplete>
                </v-col>
                <v-col class="px-1" cols="12">
                  <v-combobox
                    class="font-weight-light caption"
                    v-model="toAdd.selectedName"
                    :items="employees"
                    autocomplete="off"
                    outlined
                    dense
                    hide-details
                    clearable
                    chips
                    small-chips
                    item-text="text"
                    item-value="value"
                    label="Attendees"
                    multiple
                  ></v-combobox>
                </v-col>
                <v-col class="px-1" cols="12">
                  <v-textarea
                    outlined
                    v-model="toAdd.info"
                    :counter="100"
                    :rules="infoRules"
                    class="pa-0 font-weight-light text-xl-h4"
                    auto-grow
                    rows="3"
                    row-height="20"
                    label="Information"
                  ></v-textarea>
                </v-col>
                <v-col class="px-1" cols="11" sm="5">
                  <!-- <v-dialog
                    ref="dialog1"
                    v-model="modalTimeFrom"
                    :return-value.sync="toAdd.timeFrom"
                    persistent
                    width="290px"
                  >
                    <template v-slot:activator="{ on, attrs }">
                      <v-text-field
                        v-model="toAdd.timeFrom"
                        label="From:"
                        prepend-icon="mdi-clock-outline"
                        readonly
                        :rules="[rules.time(toAdd.timeFrom, toAdd.timeTo)]"
                        v-bind="attrs"
                        v-on="on"
                      ></v-text-field>
                    </template>
                    <v-time-picker
                      v-if="modalTimeFrom"
                      v-model="toAdd.timeFrom"
                      :max="toAdd.timeTo"
                      full-width
                    >
                      <v-spacer></v-spacer>
                      <v-btn text color="primary" @click="modalTimeFrom = false"
                        >Cancel</v-btn
                      >
                      <v-btn
                        text
                        color="primary"
                        @click="$refs.dialog1.save(toAdd.timeFrom)"
                        >OK</v-btn
                      >
                    </v-time-picker>
                  </v-dialog> -->
                  <v-text-field
                    type="time"
                    required
                    v-model="toAdd.timeFrom"
                    :rules="[rules.time(toAdd.timeFrom, toAdd.timeTo)]"
                    label="From"
                    prepend-icon="mdi-clock-outline"
                    hint="( HH : MM :AM/PM)"
                    persistent-hint
                  >
                  </v-text-field>
                </v-col>
                <v-spacer></v-spacer>
                <v-col cols="12" sm="5">
                  <!-- <v-dialog
                    ref="dialog2"
                    v-model="modalTimeTo"
                    :return-value.sync="toAdd.timeTo"
                    persistent
                    width="290px"
                  >
                    <template v-slot:activator="{ on, attrs }">
                      <v-text-field
                        v-model="toAdd.timeTo"
                        label="To:"
                        prepend-icon="mdi-clock-outline"
                        readonly
                        :rules="[rules.time(toAdd.timeFrom, toAdd.timeTo)]"
                        v-bind="attrs"
                        v-on="on"
                      ></v-text-field>
                    </template>
                    <v-time-picker
                      v-if="modalTimeTo"
                      v-model="toAdd.timeTo"
                      :min="toAdd.timeFrom"
                      full-width
                    >
                      <v-spacer></v-spacer>
                      <v-btn text color="primary" @click="modalTimeTo = false"
                        >Cancel</v-btn
                      >
                      <v-btn
                        text
                        color="primary"
                        @click="$refs.dialog2.save(toAdd.timeTo)"
                        >OK</v-btn
                      >
                    </v-time-picker>
                  </v-dialog> -->
                  <v-text-field
                    type="time"
                    required
                    v-model="toAdd.timeTo"
                    :rules="[rules.time(toAdd.timeFrom, toAdd.timeTo)]"
                    label="To"
                    prepend-icon="mdi-clock-outline"
                    hint="( HH : MM :AM/PM)"
                    persistent-hint
                  >
                  </v-text-field>
                </v-col>
              </v-row>
              <v-divider></v-divider>
              <v-card-actions class="px-1">
                <v-btn
                  block
                  color="primary"
                  :disabled="!valid"
                  @click="saveSchedule()"
                  >{{ btnName }}</v-btn
                >
              </v-card-actions>
            </v-form>
          </v-card-text>
        </v-card>
      </v-dialog>
    </v-row>
  </div>
</template>
<script>
import moment from 'moment'
import axios from 'axios'
import { RRule } from 'rrule'
export default {
  name: 'Calendar',
  components: {},
  data() {
    return {
      modalTimeTo: false,
      modalTimeFrom: false,

      companies: [],
      departments: [],
      sections: [],
      employees: [],
      companyColor: ['#F44336', '#2196F3', '#009688', '#4CAF50', '#F57F17'],

      dailyDates: [],
      yearNow: null,
      monthNow: null,
      monthlyOpsDefault: null,
      monthlyOps: [
        { text: 'First', value: 1 },
        { text: 'Second', value: 2 },
        { text: 'Third', value: 3 },
        { text: 'Fourth', value: 4 },
        { text: 'Last', value: 5 },
      ],
      todayNow: null,
      weekDayNow: null,
      weekDailyNow: [0, 1, 2, 3, 4, 5, 6],
      endDefaultOps: 'Until',
      endOptions: ['Until', 'Count'],
      dateUntil: moment().format('YYYY-MM-DD'),
      repeatDay: 1,
      repeatWeek: 1,
      repeatMonth: 1,
      countNumbers: 30,
      occur: 'Never',
      recurringOptions: ['Never', 'Daily', 'Weekly', 'Monthly'],
      weekday: [
        { text: 'Sunday', value: 6 },
        { text: 'Monday', value: 0 },
        { text: 'Tuesday', value: 1 },
        { text: 'Wednesday', value: 2 },
        { text: 'Thursday', value: 3 },
        { text: 'Friday', value: 4 },
        { text: 'Saturday', value: 5 },
      ],
      mode: 'column',
      // weekdays: [],
      recurringDialog: false,
      menu: false,
      colorSection: '#1976D2FF',
      colorMenu: false,
      switch1: true,
      settingsDialog: false,
      titleName: '',
      btnName: '',

      screenHeight: 0,
      screenWidth: 0,

      selectedSection: '',
      sectionOptions: [],
      sectionProp: [],
      selectedDepartment: '',
      departmentOptions: [],
      hideTextField: 1,
      selectedName: [],
      requestingName: [],
      attendees: [],
      editedIndex: -1,
      dialog: false,
      showBtn: true,
      timeFrom: null,
      timeTo: null,
      modal: false,
      timeMin: moment().format('07:00'),
      timeMax: moment().format('16:00'),
      date: moment().format('YYYY-MM-DD'),
      toAdd: {},
      //    #############CALENDAR###############
      focus: '',
      type: 'month',
      typeToLabel: {
        month: 'Month',
        week: 'Week',
        day: 'Day',
        '4day': '4 Days',
      },
      selectedDate: moment().format('YYYY-MM-DD'),
      valid: true,
      name: null,
      nameRules: [v => !!v || 'Title is required'],
      info: null,
      infoRules: [
        v => !!v || 'Description is required',
        v =>
          (v && v.length <= 100) ||
          'Description must be less than 100 characters',
      ],
      start: null,
      end: null,
      color: null,
      selectedEvent: {},
      selectedElement: null,
      selectedOpen: false,

      schedules: [],
      listSectionColor: '',
      sectionColor: '',

      rules: {
        time(from, to) {
          const format = 'hh:mm'
          let timeFrom = moment(from, format),
            timeTo = moment(to, format)
          if (!from || !to) {
            return 'Please input both.'
          } else if (timeFrom.isSameOrAfter(timeTo)) {
            return 'Time error.'
          } else {
            return true
          }
        },
      },
    }
  },
  mounted() {
    this.screenHeight = window.screen.availHeight
    this.screenWidth = window.screen.availWidth
    this.$refs.calendar.checkChange()
  },
  watch: {
    // timeRules: 'saveTest',
  },
  computed: {
    timeRules: {
      get() {
        const timeRules = []
        if (this.timeMin) {
          const rule = v => {
            const format = 'hh:mm'
            let time = moment(v, format),
              beforeTime = moment('05:59:00', format),
              afterTime = moment('16:01:00', format)
            time.isBetween()
            if (!time.isBetween(beforeTime, afterTime)) {
              return 'Around 6:00AM to 4:00PM only.'
            } else {
              return true
            }
          }
          timeRules.push(rule)
        }
        return timeRules
      },
      set(newVal) {
        this.timeRules = newVal
      },
    },
    filteredSchedules: {
      get() {
        return this.schedules
          .map(rec => {
            if (!rec.requestingName) {
              rec.requestingName = []
            }
            return rec
          })

          .filter(rec => {
            // console.table(rec)
            return rec.start.includes(this.selectedDate)
          })
      },
      set(newVal) {
        this.schedules = newVal
      },
    },
    title() {
      const { start, end } = this
      if (!start || !end) {
        return ''
      }

      const startMonth = this.monthFormatter(start)
      const endMonth = this.monthFormatter(end)
      const suffixMonth = startMonth === endMonth ? '' : endMonth

      const startYear = start.year
      const endYear = end.year
      const suffixYear = startYear === endYear ? '' : endYear

      switch (this.type) {
        case 'month':
          return `${startMonth} ${startYear}`
        case 'week':
        case '4day':
          return `${startMonth}  ${startYear} - ${suffixMonth}  ${suffixYear}`
        case 'day':
          return `${startMonth} ${startYear}`
      }
      return ''
    },
    monthFormatter() {
      return this.$refs.calendar.getFormatter({
        timeZone: 'UTC',
        month: 'long',
      })
    },
  },
  created() {
    this.getFilteredEvent()
    // this.getSchedules()
    this.getCompanies().then(() => {
      this.getDepartments().then(() => {
        this.getSections().then(() => {
          this.getEmployees().then(() => {})
        })
      })
    })
  },
  methods: {
    async getCompanies() {
      try {
        let res = await this.$http.get(`${process.env.VUE_APP_URL}/companies`)
        this.companies = res.data.map((item, index) => {
          return {
            text: item.text,
            value: item.value,
            color: this.companyColor[index],
          }
        })
      } catch (err) {
        throw new TypeError(err)
      }
    },
    async getDepartments() {
      try {
        let res = await this.$http.get(
          `${process.env.VUE_APP_URL}/departments?CompanyCode=${this.toAdd.selectedCompany}`,
        )
        this.departments = res.data
      } catch (err) {
        throw new TypeError(err)
      }
      this.getSections()
    },
    async getSections() {
      try {
        let res = await this.$http.get(
          `${process.env.VUE_APP_URL}/sections?CompanyCode=${this.toAdd.selectedCompany}&DepartmentCode=${this.toAdd.selectedDepartment}`,
        )
        if (res.data.length > 0) {
          this.sections = res.data
          this.getEmployees()
        } else {
          this.employees = []
          this.sections = []
          this.getEmployees()
        }
      } catch (err) {
        throw new TypeError(err)
      }
    },
    async getEmployees() {
      // http://10.169.141.101:6080/api/employees?CompanyCode=003&DepartmentCode=123&SectionCode=00451
      try {
        let res = await this.$http.get(
          `${process.env.VUE_APP_URL}/employees?CompanyCode=${this.toAdd.selectedCompany}&DepartmentCode=${this.toAdd.selectedDepartment}&SectionCode=${this.toAdd.selectedSection}`,
        )
        this.employees = res.data
      } catch (err) {
        throw new TypeError(err)
      }
    },

    async getSchedules() {
      try {
        let res = await this.$http.get(
          `${process.env.VUE_APP_URL}/db/schedules`,
        )
        this.schedules = res.data
      } catch (err) {
        throw new TypeError(err)
      }
    },

    dailyRepeat(startDate, endDate, wkdaily, interval, count) {
      this.dailyDates = []
      const rule = new RRule({
        freq: RRule.DAILY,
        interval: interval,
        count: count,
        byweekday: wkdaily,
        dtstart: new Date(startDate),
        until: new Date(endDate),
      })
      let dailyDatesMoment = rule.all().map(rec => {
        return rec.toISOString().split('T')[0]
      })
      this.dailyDates = dailyDatesMoment
      this.recurringDialog = false
    },
    weeklyRepeat(startDate, endDate, interval, wkdy, count) {
      this.dailyDates = []
      const rule = new RRule({
        freq: RRule.WEEKLY,
        interval: interval,
        count: count,
        byweekday: wkdy,
        dtstart: new Date(startDate),
        until: new Date(endDate),
      })
      let dailyDatesMoment = rule.all().map(rec => {
        return rec.toISOString().split('T')[0]
      })
      this.dailyDates = dailyDatesMoment
      this.recurringDialog = false
    },
    monthlyRepeat(startDate, endDate, weekNum, interval, wkdy, count) {
      this.dailyDates = []
      const rule = new RRule({
        freq: RRule.MONTHLY,
        interval: interval,
        count: count,
        byweekday: wkdy,
        bysetpos: weekNum,
        dtstart: new Date(startDate),
        until: new Date(endDate),
      })
      let dailyDatesMoment = rule.all().map(rec => {
        return rec.toISOString().split('T')[0]
      })
      this.dailyDates = dailyDatesMoment
      this.recurringDialog = false
    },
    getWeekOfMonth(dateToday, dayToday) {
      return Math.ceil((dateToday + 6 - dayToday) / 7)
    },
    recurringEvents() {
      this.recurringDialog = true
    },

    openSettingsDialog() {
      this.settingsDialog = true
    },
    cancelSched(rec, i) {
      this.toAdd = Object.assign({}, rec)
      this.toAdd.requestingName = rec.requestingName
      if (
        this.filteredSchedules[i].requestingName.indexOf(
          this.$store.state.users.info.EmployeeName,
        ) !== -1
      ) {
        const index = this.filteredSchedules[i].requestingName.indexOf(
          this.$store.state.users.info.EmployeeName,
        )
        this.toAdd.requestingName.splice(index, 1)
        this.filteredSchedules[i].requestingName = this.toAdd.requestingName

        this.$http
          .put(`${process.env.VUE_APP_URL}/db/updateSchedule`, rec)
          .then(() => {
            this.getSchedules()
          })
          .catch(err => {
            throw err
          })
      }
      setTimeout(() => {
        this.showBtn = true
      }, 300)
    },
    joinSched(rec, i) {
      if (rec.start < this.date) {
        alert('Past date cannot join.')
      } else {
        this.toAdd = Object.assign({}, rec)
        this.toAdd.selectedName = rec.selectedName
        this.toAdd.reservedBy = rec.reservedBy
        if (this.toAdd.requestingName.length) {
          if (
            this.toAdd.selectedName.indexOf(
              this.$store.state.users.info.EmployeeName,
            ) == -1 &&
            this.filteredSchedules[i].requestingName.indexOf(
              this.$store.state.users.info.EmployeeName,
            ) == -1
          ) {
            this.toAdd.requestingName.unshift(
              this.$store.state.users.info.EmployeeName,
            )
            this.filteredSchedules[i].requestingName = this.toAdd.requestingName

            this.$http
              .put(`${process.env.VUE_APP_URL}/db/updateSchedule`, rec)
              .then(() => {
                this.getSchedules()
              })
              .catch(err => {
                throw err
              })
          } else {
            alert('Included')
          }
        } else if (
          this.toAdd.selectedName.indexOf(
            this.$store.state.users.info.EmployeeName,
          ) == -1
        ) {
          this.toAdd.requestingName.unshift(
            this.$store.state.users.info.EmployeeName,
          )
          this.filteredSchedules[i].requestingName = this.toAdd.requestingName
          this.$http
            .put(`${process.env.VUE_APP_URL}/db/updateSchedule`, rec)
            .then(() => {
              this.getSchedules()
              // this.filteredSchedules[i]._rev = res.data.rev
            })
            .catch(err => {
              throw err
            })
        } else {
          alert('INCLUDED')
        }
        setTimeout(() => {
          this.toAdd = {}
          this.editedIndex = -1
          this.showBtn = false
        }, 300)
      }
    },
    removeAttendeesList() {
      this.attendees = []
    },
    getReserver() {
      this.toAdd.selectedName = []
      this.toAdd.selectedName.push(this.$store.state.users.info.EmployeeName)
    },
    saveSettings(colorSec) {
      this.colorMenu = false
      return new Promise((resolve, reject) => {
        axios
          .all([
            axios.post(
              `${this.api}post/modify/${this.userInfo.department}/section_color/${this.userInfo.section}`,
              { color: colorSec },
            ),
            axios.post(
              `${this.api}post/updateBulkDocs/bySection/${this.userInfo.section}`,
              { sectionColor: colorSec },
            ),
          ])
          .then(
            axios.spread((secRes, updateRes) => {
              resolve(secRes, updateRes)
            }),
          )
          .catch((secErr, updateErr) => {
            reject(secErr, updateErr)
          })
      })
    },
    getFilteredEvent() {
      if (this.switch1 === true) {
        this.getSchedules()
      } else {
        this.getSchedules().then(() => {
          this.schedules = this.schedules.filter(sched => {
            return sched.start >= this.date
          })
        })
      }
    },
    saveSchedule() {
      if (this.$refs.form.validate()) {
        if (this.editedIndex <= -1) {
          if (!this.$store.state.users.isJA) {
            this.toAdd.reservedBy = this.$store.state.users.info.EmployeeName
          } else {
            this.toAdd.reservedBy =
              this.$store.state.users.info.FirstNameEng +
              ' ' +
              this.$store.state.users.info.LastNameEng
          }
          if (this.dailyDates.length > 0) {
            for (let i = 0; i < this.dailyDates.length; i++) {
              let RR = this.dailyDates[i]
              this.toAdd.start = RR
              this.toAdd.end = RR
              this.schedules.unshift(this.toAdd)
              this.schedules.sort((a, b) => a.start.localeCompare(b.start))
              // console.table(this.schedules)
              // let toAdd = {}
              // toAdd = Object.assign(toAdd, this.toAdd)
              // console.log(toAdd)
              this.$http
                .post(`${process.env.VUE_APP_URL}/db/saveSchedule`, this.toAdd)
                .then(() => {
                  this.getSchedules()
                })
            }
          } else {
            delete this.toAdd.end
            // let toAdd = {}
            // toAdd = Object.assign(toAdd, this.toAdd)
            this.$http
              .post(`${process.env.VUE_APP_URL}/db/saveSchedule`, this.toAdd)
              .then(() => {
                this.getSchedules()
              })
          }
        } else {
          Object.assign(this.schedules[this.editedIndex], this.toAdd)
          this.$http
            .put(`${process.env.VUE_APP_URL}/db/updateSchedule`, this.toAdd)
            .then(() => {
              this.getSchedules()
            })
            .catch(err => {
              throw new Error(err)
            })
        }
        this.closeDialog()
        this.$refs.form.resetValidation()
      }
    },
    editEvent(rec) {
      if (rec.start < this.date) {
        alert('Past date cannot edit.')
      } else {
        this.toAdd.reservedBy = rec.reservedBy
        if (
          this.toAdd.reservedBy === this.$store.state.users.info.EmployeeName ||
          this.toAdd.reservedBy ===
            this.$store.state.users.info.FirstNameEng +
              ' ' +
              this.$store.state.users.info.LastNameEng
        ) {
          this.editedIndex = this.schedules.indexOf(rec)
          this.toAdd = Object.assign({}, rec)
          this.titleName = 'Edit Schedule'
          this.btnName = 'Update'
          this.toAdd.selectedDepartment = rec.selectedDepartment
          this.toAdd.selectedSection = rec.selectedSection
          this.getCompanies().then(() => {
            this.getDepartments().then(() => {
              this.getSections().then(() => {
                this.getEmployees().then(() => {})
              })
            })
          })
          this.dialog = true
        } else {
          alert('Only the reserver can edit')
        }
      }
    },
    deleteEvent(rec) {
      if (rec.start < this.date) {
        alert('Past date cannot delete.')
      } else {
        this.toAdd.reservedBy = rec.reservedBy
        if (
          this.toAdd.reservedBy === this.$store.state.users.info.EmployeeName ||
          this.toAdd.reservedBy ===
            this.$store.state.users.info.FirstNameEng +
              ' ' +
              this.$store.state.users.info.LastNameEng
        ) {
          const index = this.schedules.indexOf(rec)
          let r = confirm('Are you sure you want to delete this event?')
          if (r === true) {
            this.schedules.splice(index, 1)
            axios
              .post(`${process.env.VUE_APP_URL}/db/deleteSchedule`, rec)
              .then(() => {
                this.getCompanies().then(() => {
                  this.getDepartments().then(() => {
                    this.getSections().then(() => {
                      this.getEmployees().then(() => {})
                    })
                  })
                })
              })
          }
        } else {
          alert('Only the reserver can delete')
        }
      }
    },
    addSched({ date, year, month, day, weekday }) {
      this.todayNow = day
      this.yearNow = year
      this.monthNow = month
      this.weekDayNow = weekday
      this.monthlyOpsDefault = this.getWeekOfMonth(day, weekday)
      if (this.date <= date) {
        this.toAdd.end = this.end.date
        this.toAdd.start = date
        this.toAdd.date = date
        this.dialog = true
        this.titleName = 'Schedule'
        this.btnName = 'Save'
        if (!this.$store.state.users.isJA) {
          this.toAdd.selectedCompany = this.$store.state.users.info.CompanyCode
          this.toAdd.selectedDepartment = this.$store.state.users.info.DepartmentCode
          this.toAdd.selectedSection = this.$store.state.users.info.SectionCode
          // this.toAdd.selectedCompany = this.$store.state.users.info.CompanyCode
          // this.toAdd.selectedDepartment = this.$store.state.users.info.DepartmentCode
          // this.toAdd.selectedSection = this.$store.state.users.info.SectionCode
          this.companies.find(item => {
            if (item.value == this.$store.state.users.info.CompanyCode) {
              this.toAdd.companyColor = item.color
            }
          })
          this.toAdd.selectedName = []
          this.toAdd.selectedName.push({
            text: this.$store.state.users.info.EmployeeName,
            value: this.$store.state.users.info.EmployeeCode,
          })
        } else {
          this.companies.find(item => {
            if (item.text == this.$store.state.users.info.Comp_Name) {
              this.toAdd.companyColor = '#696969'
            }
          })
          this.toAdd.selectedName = []
          this.toAdd.selectedName.push({
            text:
              this.$store.state.users.info.FirstNameEng +
              ' ' +
              this.$store.state.users.info.LastNameEng,
            value: this.$store.state.users.info.id,
          })
        }
      } else {
        alert('Past Date')
      }
      this.getCompanies().then(() => {
        this.getDepartments().then(() => {
          this.getSections().then(() => {
            this.getEmployees().then(() => {})
          })
        })
      })
    },
    closeDialog() {
      this.dialog = false
      this.dailyDates = []
      setTimeout(() => {
        this.toAdd = {}
        this.$refs.form.resetValidation()
        this.editedIndex = -1
      }, 300)
    },
    closeRecurring() {
      this.recurringDialog = false
      this.dailyDates = []
      // setTimeout(() => {

      // }, 300);
    },
    viewDay({ date }) {
      this.selectedDate = date
    },
    getEventColor(event) {
      return event.companyColor
    },
    setToday({ date }) {
      this.selectedDate = date
      this.focus = this.today
    },
    prev() {
      this.$refs.calendar.prev()
    },
    next() {
      this.$refs.calendar.next()
    },
    updateRange({ start, end }) {
      if (!this.month) {
        this.$refs.calendar.scrollToTime('06:58')
      }
      this.start = start
      this.end = end
    },
  },
}
</script>
<style>
.compact-form {
  transform: scale(0.8);
}
.disable-events {
  pointer-events: none;
}
.tile {
  margin: 5px;
  border-radius: 4px;
}
.tile:hover {
  background: green;
}
.tile:active {
  background: yellow;
}
div.v-select-list div[role='list'] div[role='listitem']:hover {
  background-color: #00857a;
}
.scroll {
  overflow-y: auto;
}
.responsive {
  width: 100%;
  height: auto;
  /* display: block; */
  margin-left: auto;
  margin-right: auto;
}
</style>
