'use client'
import { ActivityTypeDropdown } from "@/components/ActivityDropdown";
import { Modal } from "@/components/ui/Modal";
import { PercentDropdown } from "@/components/PercentDropdown";
import Table from "@/components/ui/Table"
import { formatDate, formatMsToDuration, parseDate } from "@/utils";
import { Trash2Icon, CopyIcon } from "lucide-react";
import { useEffect, useState } from "react";
import { HiOutlineAdjustments } from "react-icons/hi";
import { IoIosAdd } from "react-icons/io";

interface Event {
  id: string; // <-- new field
  day: string;
  ActivityType: "Unknown" | "Loading" | "Unloading" | "Maintenance" | "Shifting" | "Anchorage" | "Idle" | "Repair";
  from: string;
  to: string | null;
  duration: string | null;
  percent: "0%" | "50%" | "100%";
  deduction: string | null;
  unsorted?: boolean;
  port : string
}

export default function PortActivityPage({portSlug} : {portSlug : string}) {
  const inputRefs: Record<string, HTMLInputElement | null> = {};
  const [isMounted, setIsMounted] = useState(false)
  const [events, setEvents] = useState<Event[]>([])
  const [deleteTargetId, setDeleteTargetId] = useState<string | null>(null);

   const key = `port-events-${portSlug}`;
  // 1. Wait until client-side
  useEffect(() => {
    setIsMounted(true)
  }, [])

  // 2. Load from localStorage *after mount*
  useEffect(() => {
    if (isMounted) {
       
      const stored = localStorage.getItem(key)
      if (stored) {
        const parsed = JSON.parse(stored);
        setEvents(parsed);
      }
    }
  }, [isMounted , key])

  // 3. Save to localStorage on change
  useEffect(() => {
    if (isMounted) {
      localStorage.setItem(key, JSON.stringify(events))
    }
  }, [events, isMounted , key])

  // 4. Until mounted, render nothing or skeleton
  if (!isMounted) {
    return null;
  }

const handleAdd = () => {
  const now = new Date();
  const days = ['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat'];
  const day = days[now.getDay()];
  
  let from: string;
  let to: string | null;

  if (events.length === 0) {
    // First event: both from and to are now
    from = formatDate(now);
    to = formatDate(now);
  } else {
    // New event: from = to of previous event
    const prevEvent = events[events.length - 1];
    from = prevEvent.to || formatDate(now);
    to = from; // will be updated later via adjustments
  }

  const fromMs = parseDate(from).getTime();
  const toMs = to ? parseDate(to).getTime() : null;
  const durationMs = toMs !== null ? fromMs - toMs : null;
  const duration = durationMs !== null ? formatMsToDuration(durationMs) : null;

  const percent: '0%' | '50%' | '100%' = '100%';
  const multiplier = percent === "100%" ? 1 : percent === "50%" ? 0.5 : 0;
  const deduction = durationMs !== null ? formatMsToDuration(durationMs * multiplier) : null;

  const newEvent: Event = {
    id: crypto.randomUUID(),
    day,
    ActivityType: "Unknown",
    from,
    to,
    duration,
    percent,
    deduction,
    port: portSlug
  };

  setEvents((prev) => [...prev, newEvent]);
};
  const handleDelete = () => {
  if (!deleteTargetId) return;

  const updated = events.filter((e) => e.id !== deleteTargetId);
  if (updated.length === 1) {
    updated[0].to = "";
  }
  setEvents(updated);
  localStorage.setItem("port-events", JSON.stringify(updated));
  setDeleteTargetId(null);
};

  return (
    <div className="p-3 bg-white rounded-lg mt-10">
    <div className="flex items-center gap-2 mb-5">
        <span className="text-blue-400 rounded-xl h-5 w-1 bg-blue-400">.</span>
        <h1>Port Activity</h1>
    </div>
    <div className="flex w-full justify-end mb-2 -mt-10">
    <button onClick={handleAdd}
    className="cursor-pointer flex items-center justify-baseline px-3 py-1
     bg-slate-50 border rounded-md text-black text-sm font-bold
      border-black/20 hover:bg-slate-200 hover:border-black/60 transition-all duration-200">
      <IoIosAdd className="size-6"/>
      <span>Add New</span>
    </button>
    </div>
    <Table>
      <Table.Header>
        <th>Day</th>
        <th>Activity Type</th>
        <th>From Date & Time</th>
        <th>Duration</th>
        <th className="flex justify-center">
          <span
          className=""
          >%</span>
          </th>
        <th>To Date & Time</th>
        <th
        className="flex justify-center"
        >Remarks</th>
        <th>Deductions</th>
        <th className="flex justify-center">Actions</th>
      </Table.Header>
      <Table.Body>
      {events?.length > 0 && events?.map((el, index)=> (
        <Table.Row key={el.id} className={el.unsorted ? "bg-red-200" : ""}>
            <td>{el.day}</td>
            <td className="flex items-center justify-end"
            ><ActivityTypeDropdown
              value={el.ActivityType}
              onChange={(value) =>
                setEvents((prev) =>
                  prev.map((e) =>
                    e.id === el.id ? { ...e, ActivityType: value } : e
                  )
                )
              }
            /></td>
                 <td>
                       <div
                       onClick={() => inputRefs[el.id]?.showPicker?.()}
                       className="cursor-pointer hover:underline text-sm"
                       >
                       {el.from}
                       </div>
  <input
    ref={(ref) => { inputRefs[el.id] = ref; }}
    type="date"
    value={el.from ? el.from.split("/").reverse().join("-") : ""}
    onChange={(e) => {
      const newDate = e.target.value;
      const newFormatted = formatDate(new Date(newDate));
      const updated = events.map(event =>
        event.id === el.id ? { ...event, from: newFormatted } : event
      );
      const index = updated.findIndex((e) => e.id === el.id);
      const currentMs = parseDate(newFormatted).getTime();
      const prev = updated[index - 1];
      const next = updated[index + 1];

      const isBeforePrev = prev && currentMs < parseDate(prev.from).getTime();
      const isAfterNext = next && currentMs > parseDate(next.from).getTime();

      const final = updated.map(ev => {
        if (ev.id !== el.id) return ev;
        const toMs = ev.to ? parseDate(ev.to).getTime() : null;
        const fromMs = parseDate(newFormatted).getTime();
        const durationMs = toMs !== null ? toMs - fromMs : null;
        const duration = durationMs !== null ? formatMsToDuration(durationMs) : null;
        const multiplier = ev.percent === "0%" ? 0 : ev.percent === "50%" ? 0.5 : 1;
        const deduction = durationMs !== null ? formatMsToDuration(durationMs * multiplier) : null;
        return {
          ...ev,
          from: newFormatted,
          duration,
          deduction,
          unsorted: isBeforePrev || isAfterNext,
        };
      });
      setEvents(final);
    }}
    className="sr-only"
  />
                 </td>
            <td>{el.duration}</td>
            <td className="flex items-center-safe justify-center"
            ><PercentDropdown
              value={el.percent}
              onChange={(value) =>
                setEvents((prev) =>
                  prev.map((e) => {
                    if (e.id !== el.id) return e;
                    const toMs = e.to ? parseDate(e.to).getTime() : null;
                    const fromMs = parseDate(e.from).getTime();
                    const durationMs = toMs !== null ? toMs - fromMs : null;
                    const duration = durationMs !== null ? formatMsToDuration(durationMs) : null;
                    const multiplier = value === "100%" ? 1 : value === "50%" ? 0.5 : 0;
                    const deduction = durationMs !== null ? formatMsToDuration(durationMs * multiplier) : null;
                    return {
                      ...e,
                      percent: value,
                      duration,
                      deduction,
                    };
                  })
                )
              }
            /></td>
            <td>{el.to}</td>
            <td></td>
            <td>{el.deduction}</td>
            <td>
              <div className="flex flex-row-reverse justify-evenly  items-center">
              <Trash2Icon
            onClick={() => setDeleteTargetId(el.id)}
            className="size-4 hover:text-red-500 hover:cursor-pointer"/>
            {index !== 0 && (
            <CopyIcon
              className="size-4 hover:text-green-800 ml-2 cursor-pointer"
              onClick={() => {
                const index = events.findIndex((e) => e.id === el.id);
                const clone = { ...el, id: crypto.randomUUID() };
                const updated = [...events];
                updated.splice(index + 1, 0, clone);
                setEvents(updated);
              }}
            />
            )}
            {el.unsorted && ( 
                <HiOutlineAdjustments 
                  className="text-blue-500 size-4 cursor-pointer"
                  onClick={() => {
                    const sorted = [...events]
                      .sort((a, b) => parseDate(a.from).getTime() - parseDate(b.from).getTime())
                      .map((e, i, arr) => {
                        const to = i === 0 ? "" : arr[i - 1].from;
                        const fromMs = parseDate(e.from).getTime();
                        const toMs = to ? parseDate(to).getTime() : null;
                        const durationMs = toMs !== null ? fromMs - toMs : null;
                        const duration = durationMs !== null ? formatMsToDuration(durationMs) : null;
                        const multiplier = e.percent === "100%" ? 1 : e.percent === "50%" ? 0.5 : 0;
                        const deduction = durationMs !== null ? formatMsToDuration(durationMs * multiplier) : null;
                        return {
                          ...e,
                          to,
                          duration,
                          deduction,
                          unsorted: false,
                        };
                      });

                    setEvents(sorted);
                    localStorage.setItem(`port-events-${portSlug}`, JSON.stringify(sorted));
                  }}
             />
            )}
              </div>
            </td>
        </Table.Row>
      ))}
      </Table.Body>
    </Table>
    {deleteTargetId && (
  <Modal
    isOpen={true}
    title="Delete Confirmation"
    description="Are you sure you want to delete this event?"
    onConfirm={handleDelete}
    onCancel={() => setDeleteTargetId(null)}
  />
)}
     {events?.length <= 0 &&
      <div className="w-full flex items-center justify-center mt-5 text-gray-700">
      <span>No Port Activity Record was found.</span> 
      </div>}
    </div>
  )
}